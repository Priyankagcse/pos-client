import { MUIDataTableColumn } from "mui-datatables";
import { IUser } from "src/pages/login/login-reducer";

export const columns: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: '',
        options: {
            display: false,
            viewColumns: false,
            searchable: false
        }
    },
    {
        name: 'billNumber',
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

export interface IBillFilter {
    customerName?: string;
    billNo?: string;
    fromDate?: Date;
    toDate?: Date;
}