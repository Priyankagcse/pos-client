import { IUser } from "src/pages/login/login-reducer";

export let TaxData = [
    { text: '0%', value: '0' },
    { text: '5%', value: '5' },
    { text: '12%', value: '12' },
    { text: '18%', value: '18' },
    { text: '28%', value: '28' }
];

export let uomList = [
    { text: 'Count', value: 'count' }
];

export let UOMObj = {count: 'Count'};

export interface IProduct {
    index?: number;
    uuid?: string;
    partNumber?: string;
    productName?: string;
    productDescription?: string;
    uom?: string;
    gst?: string;
    salePrice?: number;
    purchasePrice?: number;
    stock?: number;
    discountType?: string;
    discountPer?: number;
    discountAmt?: number;
    qty?: number;
    isEdit?: boolean
}

export interface IProductProps {
    dispatch: Function;
    loginCurrentUser: IUser;
}
