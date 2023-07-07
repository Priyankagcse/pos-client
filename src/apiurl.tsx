import { API_URL } from "./config";

export const COMMONAPI = (firstParam?: any, secondParam?: any) => {
    return {
        VERSIONREFRESH: API_URL + `versionRefresh/${firstParam}/${secondParam}`
    };
};

export const USERAPI = (uuid?: string) => {
    return {
        GETBYID: API_URL + `getUser/${uuid}`,
        POST: API_URL + 'user',
        PUT: API_URL + 'user'
    };
};