import { API_TOKEN, AUTO_UPDATE_INTERVAL } from "./config";
import processDomains from "./processDomains";
import { Logger } from "./service/logger";

Logger.setVerbose(process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--verbose') !== -1)

if (!API_TOKEN || API_TOKEN.trim() === '') {
    Logger.error('API_TOKEN is not set, please define it in your environment variables', true)
}

processDomains()
if (process.argv.indexOf('--threaded') !== -1) {
    Logger.info(`Launching in threaded mode, each ${AUTO_UPDATE_INTERVAL} seconds`)
    setInterval(processDomains, AUTO_UPDATE_INTERVAL * 1000)
}