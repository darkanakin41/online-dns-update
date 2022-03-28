import ResourceRecord from "./model/ResourceRecord";
import { Logger } from "./service/logger";

export default async function processDomain(myIp: string, subdomainFQN: string,priority: number, subdomains: ResourceRecord[]) {
    Logger.info(`[${subdomainFQN}] Start processing`)
    const subdomain: ResourceRecord | undefined = subdomains.find((d: ResourceRecord) => d.name === subdomainFQN)
    if (!subdomain) {
        Logger.info(`[${subdomainFQN}] Needs to be registered`)
        subdomains.push({
            name: subdomainFQN,
            type: 'A',
            priority: priority,
            ttl: 3600,
            data: myIp,
        })
        return true
    }
    
    if (subdomain.data !== myIp) {
        Logger.info(`[${subdomainFQN}] Needs to be updated`)
        subdomain.data = myIp
        return true
    }

    Logger.success(`[${subdomainFQN}] Everything is fine, nothing to do here`)
    return false
}
