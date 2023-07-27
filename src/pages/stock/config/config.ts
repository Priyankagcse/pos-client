import { MUIDataTableColumn } from "mui-datatables";
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
            customBodyRender: (value: string, tableMeta: any) => `${value}%`
        }
    },
    {
        name: 'price',
        label: 'Price',
    },
    {
        name: 'productDescription',
        label: 'Product Description',
    }
];