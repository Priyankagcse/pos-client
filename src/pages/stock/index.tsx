import { Button, IconButton, ListItem } from "@mui/material";
import React, {useEffect, useState } from "react";
import { IStockProps, columns } from "./config/config";
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
import { IProduct } from "../product/config/config";
import { IAPIReponse } from "src/config";

function Stock(props: IStockProps) {
    let [state, setState] = useState<{productSearchList: IProduct[], stockGridData: IProduct[], productName?: string, stock?: number, purchasePrice?: number}>({productSearchList: [], stockGridData: []});
    let [addProduct, setAddProduct] = useState(false);
    const handleChange = (field: string, value: any) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    useEffect(() => {
        getStock();
    }, [])

    const productSearch = () => {
        props.dispatch(apiActions.methodAction('get', PRODUCTAPI(props.loginCurrentUser.companyUuid, state.productName).PRODUCTSEARCH, {}, (res: IAPIReponse) => {
            handleChange('productSearchList', res.data);
        }));
    }

    const stockUpdate = (prodLine: IProduct, value: number, caller: string) => {
        let productSearchList = state.productSearchList.map((line) => {
            if (prodLine.uuid === line.uuid) {
                line[caller] = value;
            }
            return line;
        });
        handleChange('productSearchList', productSearchList);
    }

    const productAdd = () => {
        let filterStockData = state.productSearchList.filter((line) => +line.stock > 0);
        if (filterStockData.length === 0) {
            props.dispatch(alertAction.error('Please fill stock'));
            return;
        }
        let insertData = {
            stockList: filterStockData,
            userUuid: props.loginCurrentUser.uuid
        };
        addCreatedBy(insertData);
        props.dispatch(apiActions.methodAction('put', STOCKAPI().STOCKBULKINSERT, insertData, (res: IAPIReponse) => {
            let concatData = (state.stockGridData).concat(filterStockData);
            handleChange('stockGridData', concatData);
            setAddProduct(false);
        }));        
    }

    const getStock = () => {
        props.dispatch(apiActions.methodAction('get', STOCKAPI(props.loginCurrentUser.companyUuid).GET, {}, (res: IAPIReponse) => {
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
            {!addProduct && <Button variant="contained" color="primary" onClick={() => {
                setAddProduct(true);
                setState({...state, productSearchList: [], productName: ''});
            }}><AddIcon/>Add Stock</Button>}
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
                        onChange={handleChange} value={state.productName} onKeyDown={(event: KeyboardEvent) => {
                            if (event.keyCode === 13) {
                                productSearch();
                            }
                        }} />
                </div>
                {state.productSearchList.map((line, ind: number) => {
                    return <ListItem className="border-bottom px-0 row m-0" key={ind}>
                            <div className="col-12 p-0 lh-16">
                                <div className="text-secondary">{line.partNumber}</div>
                                <div>{line.productName}</div>
                                <div className="text-secondary fs-12">{line.productDescription}</div>
                            </div>
                            <div className="col-6 p-0">
                                <TextFieldView placeholder="Stock" type={'number'} field={'stock'} className={'col-12'} required
                                    onChange={(field: string, value: number) => stockUpdate(line, value, 'stock')} value={line.stock} />
                            </div>
                            <div className="col-6 p-0">
                                <TextFieldView placeholder="Purchase Price" type={'number'} field={'purchasePrice'} className={'col-12'}
                                    onChange={(field: string, value: number) => stockUpdate(line, value, 'purchasePrice')} value={line.purchasePrice} />
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