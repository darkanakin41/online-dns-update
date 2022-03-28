import ApiRef from "./ApiRef";

export default interface Domain {
  id: number;
  name: string;
  dnssec: boolean;
  external: boolean;
  versions: ApiRef;
  zone: ApiRef;
}
