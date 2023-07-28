import { Autocomplete, Button, Dialog, DialogActions, DialogTitle, IconButton, ListItem, TableCell, TableFooter, TableRow, TextField } from "@mui/material";
import React, {useState } from "react";
import { TextFieldView } from "src/component/textfield-view";
import 'dayjs/locale/de';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableMeta, MUIDataTableOptions } from "mui-datatables";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { apiActions } from "src/action/action";
import { BILLAPI, PRODUCTAPI } from "src/apiurl";
import { addCreatedBy } from "src/common";
import { alertAction } from "../alert/alert-reducer";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { DropDownView } from "src/component/dropdown-view";
import { Aggregates } from "src/helper/Aggregates";
import { AmountCalc, IBill, IBillProps } from "./config/config";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import { IProduct, UOMObj } from "../product/config/config";
import { IAPIReponse } from "src/config";

function Bill (props: IBillProps) {
    let [state, setState] = useState<IBill>({
        billDate: dayjs(new Date()), totalAmt: 0
    });
    let [productSearchList, setProductSearchList] = useState<IProduct[]>([]);
    let [productLists, setProductLists] = useState<IProduct[]>([]);
    let [sidebar, setSidebar] = useState("");
    let [isConfirm, setIsConfirm] = useState(false);
    let [selectedProduct, setSelectedProduct] = useState<IProduct>({});
    
    const handleChange = (field: string, value: string | Date) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const productChange = (field: string, value: string) => {
        setSelectedProduct((prevState) => {
            if (selectedProduct.discountType === "%" && field === "discountPer") {
                prevState.discountAmt = +value / 100 * prevState.price;
            } else if (selectedProduct.discountType === "Amt" && field === "discountAmt") {
                prevState.discountPer = +value / prevState.price * 100;
            }
            return {
                ...prevState,
                [field]: value
            }
        });
    };

    const productSearch = () => {
        props.dispatch(apiActions.methodAction('get', PRODUCTAPI(props.loginCurrentUser.companyUuid, state.productName).PRODUCTSEARCHWITHSTOCK, {}, (res: IAPIReponse) => {
            setProductSearchList(res.data);
        }));
    }

    const productAdd = (isSingle?: boolean) => {
        let filterStockData: IProduct[] = []
        if (isSingle) {
            filterStockData = [AmountCalc(selectedProduct)];
        }
        productSearchList.forEach((line: IProduct) => {
            if (+line.qty > 0) {
                AmountCalc(line);
                filterStockData.push(line);
            }
        });
        if (filterStockData.length === 0) {
            props.dispatch(alertAction.error('Please Enter Quantity'));
            return;
        }
        let concatData = (productLists).concat(filterStockData);
        let totalAmt = Aggregates.sum(concatData, "amount");
        setProductLists(concatData);
        setState((prevState) => ({
            ...prevState,
            totalAmt: totalAmt
        }));
        setSidebar("");
    }

    const stockUpdate = (prodLine: IProduct, value: number) => {
        let list = productSearchList.map((line) => {
            if (prodLine.uuid === line.uuid) {
                line['qty'] = value;
            }
            return line;
        });
        setProductSearchList(list);
    }

    const onButtonClick = (event: any, uuid: string, flag: string) => {
        if (flag === 'edit') {
            let filterData = productLists.find((gridLine) => gridLine.uuid === uuid);
            setSidebar("edit");
            setSelectedProduct(filterData);
        } else {
            let filterData = productLists.filter((gridLine) => gridLine.uuid === uuid);
            setProductLists(filterData);
        }
    }

    const Columns: MUIDataTableColumn[] = [
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
            label: 'Product',
            options: {         
                customBodyRender: (value: string, tableMeta: MUIDataTableMeta) => {
                    return <div className="lh-16">
                        <div className="text-secondary">{tableMeta.rowData[1]}</div>
                        <div>{tableMeta.rowData[2]}</div>
                        <div className="text-secondary fs-12">{tableMeta.rowData[3]}</div>
                    </div>;
                }
            }
        },
        {
            name: 'productName',
            label: 'Product Name',
            options: {
                display: false,
                viewColumns: false,
                searchable: false
            }
        },
        {
            name: 'productDescription',
            label: 'Product Description',
            options: {
                display: false,
                viewColumns: false,
                searchable: false
            }
        },
        {
            name: 'qty',
            label: 'Qty',
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
            name: 'discountAmt',
            label: 'Discount',
        },
        {
            name: 'price',
            label: 'Price',
        },
        {
            name: 'amount',
            label: 'Amount',
            options: {
                sort: false,
                  setCellHeaderProps: () => { return { align: "right" } },
                setCellProps: () => ({ style: { textAlign: 'end'  }}),
            }
        },
        {   name: 'actions', label: 'Actions',
            options: {
                filter: false, sort: false,
                customBodyRender: (value: string, tableMeta: MUIDataTableMeta) => {
                    return (<>
                        <IconButton color="primary" onClick={(e) => onButtonClick(e, tableMeta.rowData[0], 'edit')}>
                            <EditIcon></EditIcon>
                        </IconButton>
                        <IconButton onClick={(e) => onButtonClick(e, tableMeta.rowData[0], 'delete')}>
                            <DeleteIcon></DeleteIcon>
                        </IconButton>
                    </>);
                },
            }
        }
    ];

    const options: MUIDataTableOptions = {
        filter: false,
        pagination: false,
        search: false,
        selectableRowsHideCheckboxes: true,
        download: false,
        print: false,
        viewColumns: false,
        customTableBodyFooterRender: function(opts) {
            return (
                <TableFooter className={"footerClasses"} >
                  <TableRow>
                    {/* {opts.columns.map((col, index) => {
                        if (col.name === 'price') {
                          return (
                            <TableCell key={index} size="small">
                              100
                            </TableCell>
                          )
                        }
                        return <TableCell key={index} className={"footerClasses"} />;
                    }
                    )} */}
                    <TableCell colSpan={5}></TableCell>
                    <TableCell sx={{fontSize: "14px"}}>Total</TableCell>
                    <TableCell align="right" sx={{fontSize: "16px", color: "black", fontWeight: 600}}>{state.totalAmt}</TableCell>
                    </TableRow>
                </TableFooter>
            );
        }
    }

    const billSave = () => {
        let putData = {
            companyUuid: props.loginCurrentUser.companyUuid,
            userUuid: props.loginCurrentUser.uuid,
            customerName: state.customerName,
            phoneNumber: state.phoneNumber,
            address: state.address,
            billDate: '2023-07-20T06:39:34.000Z',
            lines: productLists
        };
        addCreatedBy(putData);
        props.dispatch(apiActions.methodAction('put', BILLAPI().SAVE, putData, (res: IAPIReponse) => {
            setState({ ...state, ...{billNo: res.data.billNumber}});
            setIsConfirm(true);
        }));
    }

    const billClose = () => {
        setState({ ...state, customerName: '', phoneNumber: '', address: '', billDate: dayjs(new Date())});
        setProductLists([]);
        setIsConfirm(false);
    }

    return <div>
        <div className="d-flex py-2">
            <h6 className="py-2 col">New Bill</h6>
            <Button variant="contained" color="success" onClick={() => billSave()} startIcon={<SaveIcon/>}>Save</Button>
        </div>
        <div className="row m-0 py-2">
            <div className={"col-12 bg-light p-2 row m-0 " + (sidebar ? "col-sm-9" : "col-sm-12")}>
                <div className="col-6 pb-4">
                    <Autocomplete className="col-12" options={["Srinivasan"]} value={state.customerName} freeSolo
                        onChange={(e, val) => handleChange("customerName", val)} onInputChange={(e, val) => handleChange("customerName", val)}
                        renderInput={(params) => <TextField {...params} variant="standard" label={"Customer Name"}></TextField>}
                    />
                </div>
                <div className="col-6 pb-4">
                    <TextFieldView label="Phone Number" type={'number'} field={'phoneNumber'} className={'col-12 col-sm-12'}
                        onChange={handleChange} value={state.phoneNumber} inputProps={{maxLength: 10}} placeholder={'9874563210'} />
                </div>
                <div className="col-12 pb-4">
                    <TextFieldView label={"Address"} className={"col-12"} value={state.address} onChange={handleChange}
                        multiline field={'address'}
                    />
                </div>
                <div className="col-6 pb-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                        <DatePicker
                            label="Date"
                            value={state.billDate}
                            onChange={(newValue: Date) => handleChange("billDate", newValue)}
                            slotProps={{ textField: { variant: 'standard', } }}

                        />
                    </LocalizationProvider>
                </div>
                <div className="col-12">
                    <div className="d-flex py-2">
                        <h6 className="col px-0 py-1"></h6>
                        {!sidebar && <Button variant="contained" color="primary" startIcon={<AddIcon/>} onClick={() => {
                            setSidebar("search");
                            setState({...state, productName: ''})
                            setProductSearchList([])
                        }}>Add Product</Button>}
                    </div>
                    <MUIDataTable
                        title={""}
                        data={productLists}
                        columns={Columns}
                        options={options}
                    />
                    
                </div>
            </div>
            {sidebar === "search" && <div className="col-12 col-sm-3">
                <div className="row mx-0 mb-3 bg-light">
                    <div className="col py-2">Search Product</div>
                    <div className="col-4 px-0">
                        <IconButton onClick={() => productAdd()}><SaveIcon/></IconButton>
                        <IconButton onClick={() => setSidebar("")}><CloseIcon/></IconButton>
                    </div>
                </div>
                <div className="">
                    <TextFieldView label="Search" type={'text'} field={'productName'} className={'col-12'} required
                        onChange={handleChange} value={state.productName} onKeyDown={(event: KeyboardEvent) => {
                            if (event.code === "Enter") {
                                productSearch();
                            }
                        }} />
                </div>
                <div className="">
                    {productSearchList.map((line, ind: number) => {
                        return <ListItem className="border-bottom px-0 row m-0" key={ind}>
                                <div className="col-9 p-0 lh-16">
                                    <div className="text-secondary">{line.partNumber}</div>
                                    <div>{line.productName}</div>
                                    <div className="text-secondary fs-12">{line.productDescription}</div>
                                </div>
                                <div className={"col-3 pr-0 d-flex"}>
                                    <span className={"h3 m-0"}>{line.stock}</span>
                                    <span style={{paddingTop: "10px"}}>{UOMObj[line.uom]}</span>
                                </div>
                                <div className="col-6 p-0 pt-2">
                                    <Button variant="text" size={"small"} className={""} onClick={() => {
                                        setSidebar("edit");
                                        setSelectedProduct(line);
                                    }}>More</Button>
                                </div>
                                <div className="col-6 p-0">
                                    <TextFieldView placeholder="Qty" type={'number'} field={'qty'} className={'col-12'} required
                                        onChange={(field: string, value: number) => {
                                            if (+line.stock < +value) {
                                                props.dispatch(alertAction.error('Quantity is greater than stock'));
                                                stockUpdate(line, line.stock);
                                            } else {
                                                stockUpdate(line, value);
                                            }
                                        }} value={line.qty} />
                                </div>
                                        
                        </ListItem>
                    })}
                </div>
            </div>}
            {sidebar === "edit" && <div className="col-12 col-sm-3">
                <div className="row mx-0 mb-3 bg-light">
                    <div className="col px-0 py-2">
                        <IconButton onClick={() => setSidebar("")}><BackIcon/></IconButton>
                        Product Details
                    </div>
                    <div className="col-2 px-0 py-2">
                        <IconButton onClick={() => productAdd(true)}><SaveIcon/></IconButton>
                    </div>
                </div>
                <div>
                    <div className="col-12 p-0 row m-0">
                        <div className="col-9 p-0 lh-16">
                            <div className="text-secondary">{selectedProduct.partNumber}</div>
                            <div>{selectedProduct.productName}</div>
                            <div className="text-secondary fs-12">{selectedProduct.productDescription}</div>
                        </div>
                        <div className={"col-3 pr-0 d-flex"}>
                            <div className={"h3"}>{selectedProduct.stock}</div>
                            <div className={""}>{selectedProduct.uom}</div>
                        </div>
                    </div>
                    <div className="col-12 pb-4 d-flex">
                        <div className="col-4 px-0">
                            <DropDownView type={'text'} field={'discountType'} className={'col-12 '}
                                onChange={productChange} value={selectedProduct.discountType} dataSource={[{text: "%", value:"%"}, {text: "Amt", value:"Amt"}]}
                                fields={{text: 'text', value: 'value'}} variant="standard"></DropDownView>
                        </div>
                        <div className="col-8 px-0">
                            {selectedProduct.discountType === "%" ? <TextFieldView label="Discount" type={'number'} field={'discountPer'} className={'col-12 '}
                                onChange={productChange} value={selectedProduct.discountPer} /> :
                            <TextFieldView label="Discount" type={'number'} field={'discountAmt'} className={'col-12 '}
                                onChange={productChange} value={selectedProduct.discountAmt} />}
                        </div>
                    </div>
                    <div className="col-12 pb-4">
                        <TextFieldView label="Quantity" type={'number'} field={'qty'} className={'col-12 '} required
                            onChange={productChange} value={selectedProduct.qty} />
                    </div>
                    <div className="col-12 pb-4">
                        <TextFieldView label="Sale Price" type={'number'} field={'price'} className={'col-12 '} required
                            onChange={productChange} value={selectedProduct.price} />
                    </div>
                </div>
            </div>}
        </div>
        <Dialog open={isConfirm} onClose={() => billClose()}>
            <DialogTitle>{state.billNo + " Bill Generated Successfully"}</DialogTitle>
            <DialogActions className="pb-3">
                <Button variant="contained" color="primary" onClick={() => billClose()}>Ok</Button>
                <Button onClick={() => billClose()} autoFocus>Cancel</Button>
            </DialogActions>
        </Dialog>
    </div>;
}

function mapStateToProps(state: IState) {
    return {
        loginCurrentUser: state.loginUser.loginCurrentUser
    };
}

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bill);