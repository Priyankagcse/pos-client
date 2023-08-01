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

export const PRODUCTAPI = (firstParam?: any, secondParam?: any) => {
    return {
        POST: API_URL + 'product',
        PUT: API_URL + 'product',
        GET: API_URL + `product/${firstParam}`,
        DELETE: API_URL + 'product',
        PRODUCTSEARCH: API_URL + `productSearch/${firstParam}/${secondParam}`,
        GETPRODUCT: API_URL + 'getProduct',
        PRODUCTSEARCHWITHSTOCK: API_URL + `productSearchWithStock/${firstParam}/${secondParam}`
    };
};

export const STOCKAPI = (firstParam?: any) => {
    return {
        POST: API_URL + 'stock',
        PUT: API_URL + 'stock',
        GET: API_URL + `stock/${firstParam}`,
        DELETE: API_URL + 'stock',
        STOCKBULKINSERT: API_URL + 'stockBulkInsert',
    };
};

export const BILLAPI = () => {
    return {
        SAVE: API_URL + 'billSave'
    };
};

export const BILLHISTORYAPI = (firstParam?: any, secondParam?: any) => {
    return {
        HEADER: API_URL + `billHeaderHistory/${firstParam}`,
        LINES: API_URL + `billLinesHistory/${firstParam}/${secondParam}`
    };
};