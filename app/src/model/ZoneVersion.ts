import ApiRef from "./ApiRef";

export default interface ZoneVersion {
  uuid_ref: string;
  name: string;
  creation_date: string;
  active: boolean;
  zone: ApiRef;
  domain: ApiRef;
}
