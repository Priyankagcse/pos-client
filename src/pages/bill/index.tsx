import { Autocomplete, Button, IconButton, ListItem, TextField } from "@mui/material";
import React, {useState } from "react";
import { TextFieldView } from "src/component/textfield-view";
import { Columns } from "./config/config";
import 'dayjs/locale/de';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { apiActions } from "src/action/action";
import { PRODUCTAPI, STOCKAPI } from "src/apiurl";
import { addCreatedBy } from "src/common";
import { alertAction } from "../alert/alert-reducer";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";

function Bill (props: any) {
    let [state, setState] = useState({productSearchList: []} as any);
    let [addProduct, setAddProduct] = useState(false);
    const handleChange = (field: any, value: any) => {
        setState((prevState: any) => ({
            ...prevState,
            [field]: value
        }));
    };

    const productSearch = () => {
        props.dispatch(apiActions.methodAction('get', PRODUCTAPI(props.loginCurrentUser.companyUuid, state.productName).PRODUCTSEARCH, {}, (res: any) => {
            handleChange('productSearchList', res.data);
        }));
    }

    const productAdd = () => {
        let filterStockData = state.productSearchList.filter((line: any) => +line.stock > 0);
        if (filterStockData.length === 0) {
            props.dispatch(alertAction.error('Please fill stock'));
            return;
        }
        let insertData = {
            stockList: filterStockData,
            userUuid: props.loginCurrentUser.uuid
        };
        addCreatedBy(insertData);
        props.dispatch(apiActions.methodAction('put', STOCKAPI().STOCKBULKINSERT, insertData, (res: any) => {
            let concatData = (state.stockGridData).concat(filterStockData);
            handleChange('stockGridData', concatData);
            setAddProduct(false);
        }));        
    }

    const stockUpdate = (prodLine: any, value: any) => {
        let productSearchList = state.productSearchList.map((line: any, ind: number) => {
            if (prodLine.uuid === line.uuid) {
                line['stock'] = value;
            }
            return line;
        });
        handleChange('productSearchList', productSearchList);
    }

    const options: MUIDataTableOptions = {
        filter: false,
        pagination: false,
        search: false,
        selectableRowsHideCheckboxes: true,
        download: false,
        print: false,
        viewColumns: false
    }

    return <div>
        <div className="py-2">
            <h6>New Bill</h6>
        </div>
        <div className="row p-2">
            <div className={"col-12 bg-light p-2 row " + (addProduct ? "col-sm-9" : "col-sm-12")}>
                <div className="col-6 pb-4">
                    <Autocomplete className="col-12" options={[]} value={state.customer} freeSolo onChange={handleChange}
                        renderInput={(params) => <TextField {...params} variant="standard" label={"Customer"}></TextField>}
                    />
                </div>
                <div className="col-6 pb-4">
                    <TextFieldView className={"col-12"} label={"Phone Number"} value={state.phoneNumber} onChange={handleChange}
                        />
                </div>
                <div className="col-12 pb-4">
                    <TextFieldView label={"Address"} className={"col-12"} value={state.address} onChange={handleChange}
                        multiline
                    />
                </div>
                <div className="col-6 pb-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                        <DatePicker
                            label="Date"
                            value={state.date}
                            onChange={(newValue: Date) => handleChange("date", newValue)}
                            slotProps={{ textField: { variant: 'standard', } }}
                        />
                    </LocalizationProvider>
                </div>
                <div className="col-12">
                    <MUIDataTable
                        title={""}
                        data={[]}
                        columns={Columns}
                        options={options}
                    />
                    <Button onClick={() => setAddProduct(true)}>Add Product</Button>
                </div>
            </div>
            {addProduct && <div className="col-12 col-sm-3">
                <div className="row m-0 pb-3">
                    <div className="col px-0 py-2">Search Product</div>
                    <div className="col-4 px-0">
                        <IconButton onClick={() => productAdd()}><SaveIcon/></IconButton>
                        <IconButton onClick={() => setAddProduct(false)}><CloseIcon/></IconButton>
                    </div>
                </div>
                <div className="col-12 p-0">
                    <TextFieldView label="Search" type={'text'} field={'productName'} className={'col-12'} required
                        onChange={handleChange} value={state.productName} onKeyDown={(event: any) => {
                            if (event.keyCode === 13) {
                                productSearch();
                            }
                        }} />
                </div>
                {state.productSearchList.map((line: any, ind: number) => {
                    return <ListItem className="border-bottom px-0" key={ind}>
                            <div className="col p-0 lh-16">
                                <div className="text-secondary">{line.partNumber}</div>
                                <div>{line.productName}</div>
                                <div className="text-secondary fs-12">{line.productDescription}</div>
                            </div>
                            <div className="col-3 p-0">
                                <TextFieldView label="Stock" type={'number'} field={'stock'} className={'col-12'} required
                                    onChange={(field: any, value: any) => stockUpdate(line, value)} value={state.stock} />
                            </div>
                    </ListItem>
                })}
            </div>}
        </div>
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