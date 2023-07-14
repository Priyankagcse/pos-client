import { Button, ListItem } from "@mui/material";
import React, {useEffect, useState } from "react";
import { columns } from "./config/config";
import 'dayjs/locale/de';
import MUIDataTable from "mui-datatables";
import { TextFieldView } from "src/component/textfield-view";
import { apiActions } from "src/action/action";
import { PRODUCTAPI, STOCKAPI } from "src/apiurl";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { number2FormatFn } from "src/common";

function Stock(props: any) {
    let [state, setState] = useState({productSearchList: []} as any);
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
        let concatData = (state.stockGridData).concat(filterStockData);
        handleChange('stockGridData', concatData);
        setAddProduct(false);
    }

    const getStock = () => {
        props.dispatch(apiActions.methodAction('get', STOCKAPI(props.loginCurrentUser.companyUuid).GET, {}, (res: any) => {
            handleChange('stockGridData', res.data);
        }));
    }

    return <div>
        <div className="py-2">
            <h6>Stock</h6>
        </div>
        <div className="row bg-light p-2">
            {!addProduct && <div className="col-12"align="right">
                <Button onClick={() => setAddProduct(true)}>Add Product</Button>
            </div>}
            <div className={"col-12 p-2 row " + (addProduct ? "col-sm-9" : "col-sm-12")}>
                <div className="col-12 pe-0">
                    <MUIDataTable
                        title={""}
                        data={state.stockGridData}
                        columns={columns}
                        options={{}}
                    />                    
                </div>
            </div>
            {addProduct && <div className="col-12 col-sm-3">
                <div className="d-flex justify-content-end">
                    <Button onClick={() => productAdd()}>Add</Button>
                    <Button onClick={() => setAddProduct(false)}>Cancel</Button>
                </div>
                <div className="col-12">
                    <TextFieldView label="Product Name" type={'text'} field={'productName'} className={'col-12'} required
                        onChange={handleChange} value={state.productName} onKeyDown={(event: any) => {
                            if (event.keyCode === 13) {
                                productSearch();
                            }
                        }} />
                </div>
                {state.productSearchList.map((line: any, ind: number) => {
                    return <ListItem className="border-bottom">
                        <div className={'col-12 col-sm-12 row m-0'}>
                            <div className="col">
                                <div>{line.productName}</div>
                                <div className="text-secondary">{line.partNumber}</div>
                                <div className="text-secondary">{line.gst}%</div>
                                <div className="text-secondary">{line.uom}</div>
                                <div className="fw-bold">{number2FormatFn(line.price)}</div>
                                <div className="text-secondary">{line.productDescription}</div>
                                <div className="col-12">
                                    <TextFieldView label="stock" type={'number'} field={'stock'} className={'col-12'} required
                                        onChange={(field: any, value: any) => stockUpdate(line, value)} value={state.stock} />
                                </div>
                            </div>
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