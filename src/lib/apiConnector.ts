import axios from "axios";

export const axiosInstance = axios.create({});

const BASE_URL = "https://pokeapi.co/api/v2";

export const apiConnector = (
  method: any,
  url: any,
  bodyData: any,
  headers: any,
  params: any
) => {
  return axiosInstance({
    method: `${method}`,
    url: `${BASE_URL}${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
