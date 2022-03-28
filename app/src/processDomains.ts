import { DOMAINS } from "./config"
import Domain from "./model/Domain"
import DomainConfig from "./model/DomainConfig"
import ResourceRecord from "./model/ResourceRecord"
import ZoneVersion from "./model/ZoneVersion"
import processDomain from "./processDomain"
import { Logger } from "./service/logger"
import { activateVersion, addZoneToVersion, createNewVersion, deleteOldVersions, getDomains, getPublicIp, getSubdomains, getVersions } from "./utils/api"

let myIp: string = ''
export default async function processDomains() {
    try {
        const ipNow: string = await getPublicIp()
        if (ipNow === myIp) {
            return Logger.info('Current IP has not changed, nothing to do here')
        } else {
            myIp = ipNow
            Logger.info('New IP retrieved, need to check DNS configuration')
        }

        const domains: Domain[] = await getDomains()

        for (const domainConfig of DOMAINS) {
            const domain: Domain | undefined = domains.find((d: Domain) => d.name == domainConfig.domain)
            if (!domain) {
                Logger.error(`Domain "${domainConfig.domain}" not found on given account`, true)
                return
            }
            Logger.info(`[${domainConfig.domain}] Start processing`)

            const version:ZoneVersion[] = await getVersions(domain)
            await deleteOldVersions(domain, version)

            const subdomains: ResourceRecord[] = await getSubdomains(domain)
            let needToUpdate = false
            for (const subdomain of domainConfig.subdomains) {
                const subdomainFQN = `${subdomain}.${domainConfig.domain}.`
                if (await processDomain(myIp, subdomainFQN, domainConfig.priority, subdomains)) {
                    needToUpdate = true
                }
            }

            if (needToUpdate) {
                const newVersion = await createNewVersion(domain)
                for (const index in subdomains){
                    const subdomain = subdomains[index]
                    await addZoneToVersion(newVersion, {
                        name: subdomain.name,
                        priority: 2,
                        type: subdomain.type,
                        ttl: subdomain.ttl,
                        data: subdomain.data,
                        domain_name: domain.name,
                        version_id: newVersion.uuid_ref
                    })
                }
                await activateVersion(domain, newVersion)
                Logger.info(`[${domainConfig.domain}] Done updating`)
            } else {
                Logger.info(`[${domainConfig.domain}] Nothing to create or update`)
            }
        }
    } catch (error: any) {
        Logger.error(`Error ${error.status} : ${error.message}`, true)
    }
}