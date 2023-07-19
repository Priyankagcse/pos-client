import { Button, IconButton, ListItem } from "@mui/material";
import React, {useEffect, useState } from "react";
import { columns } from "./config/config";
import 'dayjs/locale/de';
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { TextFieldView } from "src/component/textfield-view";
import { apiActions } from "src/action/action";
import { PRODUCTAPI, STOCKAPI } from "src/apiurl";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { addCreatedBy, } from "src/common";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { alertAction } from "../alert/alert-reducer";

function Stock(props: any) {
    let [state, setState] = useState({productSearchList: [], stockGridData: []} as any);
    let [addProduct, setAddProduct] = useState(false);
    const handleChange = (field: any, value: any) => {
        setState((prevState: any) => ({
            ...prevState,
            [field]: value
        }));
    };

    useEffect(() => {
        getStock();
    }, [])

    const productSearch = () => {
        props.dispatch(apiActions.methodAction('get', PRODUCTAPI(props.loginCurrentUser.companyUuid, state.productName).PRODUCTSEARCH, {}, (res: any) => {
            handleChange('productSearchList', res.data);
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

    const getStock = () => {
        props.dispatch(apiActions.methodAction('get', STOCKAPI(props.loginCurrentUser.companyUuid).GET, {}, (res: any) => {
            handleChange('stockGridData', res.data);
        }));
    }

    const options: MUIDataTableOptions = {
        filter: true,
        pagination: true,
        search: true,
        selectableRowsHideCheckboxes: true,
        download: false,
        print: false,
    }

    return <div>
        <div className="d-flex py-2">
            <h6 className="col px-0 py-1">Stock</h6>
            {!addProduct && <Button variant="contained" color="primary" onClick={() => setAddProduct(true)}><AddIcon/>Add Stock</Button>}
        </div>
        <div className="row m-0">
            <div className={"col-12 px-0 py-2 " + (addProduct ? "col-sm-9" : "col-sm-12")}>
                <MUIDataTable
                    title={""}
                    data={state.stockGridData}
                    columns={columns}
                    options={options}
                />                    
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

export default connect(mapStateToProps, mapDispatchToProps)(Stock);