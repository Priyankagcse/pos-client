import { MUIDataTableColumn } from "mui-datatables";
import { IUser } from "src/pages/login/login-reducer";

export const columns: MUIDataTableColumn[] = [
    {
        name: 'billNo',
        label: 'Bill Number',
    },
    {
        name: 'customerName',
        label: 'Customer Name',
    },
    {
        name: 'billDate',
        label: 'Date',
    },
    {
        name: 'amount',
        label: 'Amount',
    },
   
];

export interface IBillHistoryProps {
    dispatch: Function;
    loginCurrentUser: IUser;
}