export let defaultValue = {
    companyData: {}
};

export interface ICompany {
    companyData: object;
}

export interface ICompanyAct {
    type: string;
    value: object;
}

export const companyConstants = {
    GET_COMPANY_DATA: 'GET_COMPANY_DATA',
};

export const companyAction = {
    getCompany: getCompany
};

function getCompany(value: any) {
    return { type: companyConstants.GET_COMPANY_DATA, value: value };
}

export function companyReducer(state: ICompany = defaultValue, action: ICompanyAct) {
    switch (action.type) {
        case companyConstants.GET_COMPANY_DATA:
            return { ...state, companyData: action.value };
        default:
            return state;
    }
}