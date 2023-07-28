import { MUIDataTableColumn, MUIDataTableMeta } from "mui-datatables";
import { IUser } from "src/pages/login/login-reducer";
import { UOMObj } from "src/pages/product/config/config";

export const columns: MUIDataTableColumn[] = [
    {
        name: 'partNumber',
        label: 'Part Number',
    },
    {
        name: 'productName',
        label: 'Product Name',
    },
    {
        name: 'productDescription',
        label: 'Product Description',
    },
    {
        name: 'stock',
        label: 'Stock',
    },
    {
        name: 'uom',
        label: 'UOM',
        options: {         
            customBodyRender: (value: string) => {
                return `${UOMObj[value] || ''}`;
            }
        }
    },
    {
        name: 'gst',
        label: 'GST',
        options: {         
            customBodyRender: (value: string, tableMeta: MUIDataTableMeta) => `${value}%`
        }
    },
    {
        name: 'price',
        label: 'Price',
    },
];

export interface IStockProps {
    dispatch: Function;
    loginCurrentUser: IUser;
}