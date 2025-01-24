import axios from "axios";
// import { JWT_TOKEN } from "@env";
import Config from "react-native-config";
const customAxios = axios.create();

if (Config.JWT_TOKEN && Config.JWT_TOKEN.length > 0) {
  customAxios.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${Config.JWT_TOKEN}`;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default customAxios;
