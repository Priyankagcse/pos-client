import { Dayjs } from "dayjs";
import { IUser } from "src/pages/login/login-reducer";

export function AmountCalc(product: any) {
	product.amount = (+product.salePrice - (product.discountAmt || 0)) * +product.qty;
	return product;
}

export interface IBill {
	billNo?: string;
	customerName?: string;
	phoneNumber?: string;
	billDate?: string | number | Date | Dayjs | null | undefined;
	address?: string;
	productName?: string;
	totalAmt: number;
	totalTax: number;
	totalDiscount: number;
	vehicleNumber?: string;
	chasisNumber?: string;
	coveredKm?: number;
	additionalCharge?: number;
}

export interface IBillProps {
    dispatch: Function;
    loginCurrentUser: IUser;
}