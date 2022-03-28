import Domain from "../model/Domain";
import ResourceRecord from "../model/ResourceRecord";
import ZoneVersion from "../model/ZoneVersion";
import client from "../service/axios";
import { Logger } from "../service/logger";
import axios from "axios";

export async function getDomains(): Promise<Domain[]> {
  Logger.info(`Retrieving domains`);
  const response = await client.get("/api/v1/domain");

  return response.data;
}
export async function getSubdomains(domain: Domain): Promise<ResourceRecord[]> {
  Logger.info(`[${domain.name}] Retrieving subdomains`);
  return (await client.get(domain.zone.$ref)).data;
}
export async function getPublicIp(): Promise<string> {
  Logger.info(`Retrieving public IP`);
  return (await axios.get("https://api.ipify.org/?format=json")).data.ip;
}
export async function getVersions(domain: Domain): Promise<ZoneVersion[]> {
  Logger.info(`[${domain.name}] Retrieving versions`);
  return (await client.get(domain.versions.$ref)).data;
}
export async function deleteOldVersions(
  domain: Domain,
  versions: ZoneVersion[]
): Promise<void> {
  Logger.info(`[${domain.name}] Checking obsolete versions`);
  versions.forEach(async (version: ZoneVersion) => {
    if (!version.active) {
      Logger.info(`[${domain.name}] deleting version ${version.name}`);
      await client.delete(version.zone.$ref.replace("/zone", ""));
      Logger.info(`[${domain.name}] version ${version.name} deleted`);
    }
  });
}
export async function createNewVersion(domain: Domain): Promise<ZoneVersion> {
  Logger.info(`[${domain.name}] Creating new version`);
  return (
    await client.post(domain.versions.$ref, {
      domain_name: domain.name,
      name: `autoupdate-${new Date().getTime()}`,
    })
  ).data;
}
export async function addZoneToVersion(
  version: ZoneVersion,
  zone: ResourceRecord
): Promise<void> {
  Logger.info(`[${zone.domain_name}] Adding record ${zone.name}`);
  return await client.post(version.zone.$ref, zone);
}
export async function activateVersion(
  domain: Domain,
  version: ZoneVersion
): Promise<void> {
  Logger.info(`[${domain.name}] Activating version ${version.name}`);
  return await client.patch(version.zone.$ref.replace("/zone", "/enable"));
}
