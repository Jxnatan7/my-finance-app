import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            Authorization: `Bearer ${cookies['@my-finance.token']}`
        }
    });

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        return Promise.reject(error);
    });

    return api;
}

export const api = setupAPIClient();