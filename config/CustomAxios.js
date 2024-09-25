import axios from "axios";
// import { JWT_TOKEN } from "@env";
import { JWT_TOKEN } from "./tokens";

const customAxios = axios.create();
if (JWT_TOKEN && JWT_TOKEN.length > 0) {
  customAxios.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${JWT_TOKEN}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default customAxios;
