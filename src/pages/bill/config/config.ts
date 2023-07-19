import { uomList } from "src/pages/product";

export const Columns: any[] = [
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
		name: 'partNumber',
		label: 'Part Number',
	},
	{
		name: 'productName',
		label: 'Product Name',
	},
	{
		name: 'uom',
		label: 'UOM',
		options: {         
			customBodyRender: (value: string) => {
				let filterData = uomList.filter((line: any) => line.value === value);
				return `${filterData.length ? filterData[0]['text'] : ''}`;
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
	},
];