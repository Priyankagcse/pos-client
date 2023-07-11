import { API_URL } from "./config";

export const COMMONAPI = (firstParam?: any, secondParam?: any) => {
    return {
        VERSIONREFRESH: API_URL + `versionRefresh/${firstParam}/${secondParam}`
    };
};

export const USERAPI = (uuid?: string, companyUuid?: string) => {
    return {
        GETBYID: API_URL + `getUser/${uuid}/${companyUuid}`,
        POST: API_URL + 'user',
        PUT: API_URL + 'user'
    };
};