import axios, { AxiosResponse, AxiosInstance } from "axios";
import { logDebugData } from "../services/CustomFunctions";

/**
 * @description service to call HTTP request via Axios
 */

class ApiService {
  public static axiosInstance: AxiosInstance;

  /**
   * @description initialize axios
   **/
  public static init() {
    ApiService.axiosInstance = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
      headers: {
        Accept: "application/json",
      },
    });
  }

  /**
   * @description send the GET HTTP request
   **/
  public static get<T>(
    resource: string,
    data?: unknown
  ): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      ApiService.axiosInstance
        .get(`${resource}`, { params: data })
        .then((response) => {
          logDebugData(`responseGetSUCCESS - ${resource}`, data);
          return resolve(response);
        })
        .catch(({ response }) => {
          logDebugData(`responseGetFAIL - ${resource}`, response);
          return reject(response);
        });
    });
  }
}

export default ApiService;
