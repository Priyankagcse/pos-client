import moment from "moment";
import { MUIDataTableColumn } from "mui-datatables";
import { IUser } from "src/pages/login/login-reducer";

export const columns: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: '',
        options: {
            display: false,
            viewColumns: false,
            searchable: false,
            filter: false
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
        name: 'vehicleNumber',
        label: 'Vehicle Number',
    },
    {
        name: 'chasisNumber',
        label: 'Chasis Number',
    },
    {
        name: 'coveredkm',
        label: 'Covered KM',
    },
    {
        name: 'billDate',
        label: 'Date',
        options: {         
            customBodyRender: (value: string) => moment(value).format("DD/MMM/YYYY hh:mm A")
        }
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
    vehicleNumber?: string;
    chasisNumber?: string;
    fromDate?: Date;
    toDate?: Date;
}