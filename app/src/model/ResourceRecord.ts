import Domain from "./Domain";

export default interface ResourceRecord {
  id?: number;
  name: string;
  type:
    | "A"
    | "AAAA"
    | "ALIAS"
    | "CNAME"
    | "HINFO"
    | "MX"
    | "NAPTR"
    | "NS"
    | "PTR"
    | "RP"
    | "SRV"
    | "TXT"
    | "TLSA"
    | "CAA";
  aux?: number;
  priority?: number;
  ttl: number;
  data: string;
  domain?: Domain;
  domain_name?: string;
  version_id?: string;
}
