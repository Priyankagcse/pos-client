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
import { IBillFilter, IBillHistoryProps, columns } from "./config/config";
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextFieldView } from "src/component/textfield-view";

function BillHistory(props: IBillHistoryProps) {
    let [state, setState] = useState<{billLineLists: IProduct[], billHeaderGridData: IProduct[], productName?: string}>({billLineLists: [], billHeaderGridData: []});
    let [addProduct, setAddProduct] = useState(false);
    let [isFilter, setIsFilter] = useState(true);
    let [filterApplied, setFilterApplied] = useState(false);
    let [filter, setFilter] = useState<IBillFilter>({});
    
    const handleChange = (field: string, value: any) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const changeFilter = (field: string, value: any) => {
        setFilter((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    const getBillHeaedr = (filterObj: IBillFilter) => {
        props.dispatch(apiActions.methodAction('put', BILLHISTORYAPI().HEADER, filterObj, (res: IAPIReponse) => {
            handleChange('billHeaderGridData', res.data);
            let filtered = false;
            Object.values(filter).forEach((val) => {
                if (val) {
                    filtered = true;
                    return;
                }
            });
            setFilterApplied(filtered);
            setIsFilter(false);
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
            <h6 className="col px-0 py-2 m-0">Bill History</h6>
            {filterApplied && <IconButton onClick={() => {
                setFilter({});
                getBillHeaedr({});
            }} title="Clear Filter">
                <FilterAltOffOutlinedIcon color={"success"}/>
            </IconButton>}
            <IconButton onClick={() => setIsFilter(!isFilter)} title="Filter">
                {isFilter ? <FilterAltIcon color={filterApplied ? "warning" : "inherit" }/> : <FilterAltOutlinedIcon color={filterApplied ? "warning" : "inherit" }/>}
            </IconButton>
        </div>
        {isFilter && <div className={"row m-0 p-2 bg-light"}>
            <div className="col-2 ">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <DatePicker
                        label="From Date"
                        value={filter.fromDate}
                        onChange={(newValue: Date) => changeFilter("fromDate", newValue)}
                        slotProps={{ textField: { variant: 'standard', } }}

                    />
                    <DatePicker
                        label="To Date"
                        value={filter.toDate}
                        onChange={(newValue: Date) => changeFilter("toDate", newValue)}
                        slotProps={{ textField: { variant: 'standard', } }}

                    />
                </LocalizationProvider>
            </div>
            <div className="col-4 ">
                <TextFieldView label="Customer Name" field={'customerName'} className={'col-12 col-sm-12'}
                    onChange={changeFilter} value={filter.customerName}/>
                <TextFieldView label="Bill Number" field={'billNo'} className={'col-12 col-sm-12'}
                    onChange={changeFilter} value={filter.billNo}/>
            </div>
            <div className="col-4 ">
                <TextFieldView label="Vehicle Number" field={'vehicleNumber'} className={'col-12 col-sm-12'}
                    onChange={changeFilter} value={filter.vehicleNumber}/>
                <TextFieldView label="Chasis Number" field={'chasisNumber'} className={'col-12 col-sm-12'}
                    onChange={changeFilter} value={filter.chasisNumber}/>
            </div>
            <div className="col-2 p-4">
                <Button variant="contained" color="primary" onClick={() => getBillHeaedr(filter)}>Filter</Button>
            </div>
        </div>}
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