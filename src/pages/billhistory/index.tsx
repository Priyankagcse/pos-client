import { Button, IconButton, ListItem } from "@mui/material";
import React, { useState } from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { apiActions } from "src/action/action";
import { BILLHISTORYAPI } from "src/apiurl";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { IProduct } from "../product/config/config";
import { IAPIReponse } from "src/config";
import { IBillHistoryProps, columns } from "./config/config";
import CloseIcon from '@mui/icons-material/Close';

function BillHistory(props: IBillHistoryProps) {
    let [state, setState] = useState<{billLineLists: IProduct[], billHeaderGridData: IProduct[], productName?: string}>({billLineLists: [], billHeaderGridData: []});
    let [addProduct, setAddProduct] = useState(false);
    const handleChange = (field: string, value: any) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const getBillHeaedr = () => {
        props.dispatch(apiActions.methodAction('get', BILLHISTORYAPI(props.loginCurrentUser.companyUuid).HEADER, {}, (res: IAPIReponse) => {
            handleChange('billHeaderGridData', res.data);
        }));
    }

    const getBillLines = (rowData: string[]) => {
        props.dispatch(apiActions.methodAction('get', BILLHISTORYAPI(props.loginCurrentUser.companyUuid, rowData[0]).LINES, {}, (res: IAPIReponse) => {
            setAddProduct(true);
            setState({ ...state, billLineLists: res.data})
        }));
    }

    const options: MUIDataTableOptions = {
        filter: true,
        pagination: true,
        search: true,
        selectableRowsHideCheckboxes: true,
        download: false,
        print: false,
        onRowClick: getBillLines,
    }

    return <div>
        <div className="d-flex py-2">
            <h6 className="col px-0 py-1">Bill History</h6>
            <Button variant="contained" color="primary" onClick={() => getBillHeaedr()}>Filter</Button>
        </div>
        <div className="row m-0">
            <div className={"col-12 px-0 py-2 " + (addProduct ? "col-sm-9" : "col-sm-12")}>
                <MUIDataTable
                    title={""}
                    data={state.billHeaderGridData}
                    columns={columns}
                    options={options}
                />                    
            </div>
            {addProduct && <div className="col-12 col-sm-3">
                <div className="d-flex pb-3">
                    <div className="col px-0 py-2">Bill Details</div>
                    <IconButton onClick={() => setAddProduct(false)}><CloseIcon/></IconButton>
                </div>
                {state.billLineLists.map((line, ind: number) => {
                    return <React.Fragment key={ind}>
                        <ListItem className="border-bottom px-0">
                            <div className="col p-0 lh-16">
                                <div className="text-secondary">{line.partNumber}</div>
                                <div>{line.productName}</div>
                                <div className="text-secondary fs-12">{line.productDescription}</div>
                            </div>
                        </ListItem>
                    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(BillHistory);