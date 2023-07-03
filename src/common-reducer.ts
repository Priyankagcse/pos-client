export let defaultValue = {
    commonName: [] as any
};

export const commonConstants = {
    commonName: 'COMMON_NAME'
};

export const commonAction = {
    commonName: commonName
};

function commonName(value: any) {
    return { type: commonConstants.commonName, value: value };
}

export function commonReducer(state = defaultValue, action: any) {
    switch (action.type) {
        case commonConstants.commonName:
            return { ...state, commonName: action.value };
        default:
            return state;
    }
}