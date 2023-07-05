import { API_URL } from "./config";

export const COMMONAPI = (firstParam?: any, secondParam?: any) => {
    return {
        GET: API_URL + `userlist`,
        PUT: API_URL + `COMMONPUT`,
        POST: API_URL + `COMMONPOST/${firstParam}/${secondParam}`,
        GETBYID: API_URL + `COMMONGETBYID`,
        VERSIONREFRESH: API_URL + `VERSIONREFRESH`
    };
};