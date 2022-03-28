import axios, { AxiosRequestConfig } from "axios";
import { API_TOKEN, API_URL } from "../config";
import { Logger } from "./logger";

const client = axios.create({ baseURL: API_URL });
client.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["Authorization"] = `Bearer ${API_TOKEN}`;
  Logger.debug(
    `Sending ${(config.method ?? "unknown").toUpperCase()} request to "${
      config.baseURL
    }${config.url}"`
  );
  return config;
});

export default client;
