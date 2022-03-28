import DomainConfig from "./model/DomainConfig";

export const API_URL: string = 'https://api.online.net';
export const API_TOKEN: string = (process.env.API_TOKEN || '').toString();

export const DOMAINS: DomainConfig[] = [
    { domain: 'p-lejeune.com', subdomains: ['home', '*.home'], priority: 2 },
    // { domain: 'mabite.com', subdomains: ['home', '*.home']},
]

export const AUTO_UPDATE_INTERVAL: number = parseInt(process.env.AUTO_UPDATE_INTERVAL || "600"); // In Seconds