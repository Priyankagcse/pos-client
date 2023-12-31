import React, {useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import { TextFieldView } from "../../component/textfield-view";
import { apiActions } from "src/action/action";
import { PRODUCTAPI } from "src/apiurl";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { DropDownView } from "../../component/dropdown-view";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableMeta, MUIDataTableOptions } from "mui-datatables";
import AddIcon from '@mui/icons-material/Add';
import { isNullOrUndefinedOrEmpty } from "src/common";
import { IProduct, IProductProps, ProductType, TaxData, UOMObj, uomList } from "./config/config";
import { IAPIReponse } from "src/config";

function Product(props: IProductProps) {
    let [state, setState] = useState<IProduct>({uom: 'count', gst: '0', productType: 0});
    let [commonState, setCommonState] = useState({openConfirm: false, gridRows: [], editRowData: {}, actionType: '',
        openForm: false, perPageCount: 3, gridCount: 0, gridPagination: -1, allGridRows: [], maxRowLimit: 5, currentPage: 0,
        caller: '', searchText: '', sortColumn: '', sortDirection: ''} as any);
    const handleChange = (field: string, value: string) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    useEffect(() => {
        changePage(0);
    }, []);

    const submit = () => {
        let productObj = { ...state };
        if (commonState.actionType === 'edit') {
            productObj['uuid'] = commonState.editRowData.uuid;
            props.dispatch(apiActions.methodAction('put', PRODUCTAPI().PUT, productObj, (res: IAPIReponse) => {
                let updatedGridData = commonState.allGridRows.map((gridLine: IProduct, ind: number) => {
                    if (gridLine.uuid === commonState.editRowData.uuid) {
                        return res.data;
                    }
                    return gridLine;
                });
                stateReset(updatedGridData, 'edit');
            }));
        } else {
            props.dispatch(apiActions.methodAction('post', PRODUCTAPI().POST, productObj, (res: IAPIReponse) => {
                commonState.allGridRows.unshift(res.data);
                stateReset(commonState.allGridRows, 'add');
            }));
        }
    }

    const onButtonClick = (event: any, uuid: string, flag: string) => {
        let filterData = commonState.gridRows.find((gridLine: IProduct) => gridLine.uuid === uuid);
        if (flag === 'edit') {
            setCommonState({ ...commonState, openForm: true, editRowData: filterData, actionType: 'edit'});
            setState({ partNumber: filterData.partNumber, productName: filterData.productName, uom: filterData.uom, gst: filterData.gst,
                salePrice: filterData.salePrice, productDescription: filterData.productDescription });
        } else {
            setCommonState({ ...commonState, openConfirm: true, editRowData: filterData, actionType: 'delete'});
        }
    }

    const prodDelete = () => {
        props.dispatch(apiActions.methodAction('delete', PRODUCTAPI().DELETE, {uuid: commonState.editRowData.uuid}, (result: IAPIReponse) => {
            changePage(commonState.currentPage, {openConfirm: false, editRowData: {}, actionType: ''});
        }));
    }

    const stateReset = (updatedGridData?: IProduct[], flag?: string) => {        
        if (updatedGridData) {
            let pagination = 0;
            if (commonState.gridCount > commonState.maxRowLimit) {
                pagination = 1;
            }
            if (flag === 'add') {
                let gridCount = commonState.gridCount + 1;
                if (gridCount > commonState.maxRowLimit) {
                    pagination = 1;
                }
                let sliceData = updatedGridData.slice(0, commonState.perPageCount);
                setCommonState({ ...commonState, allGridRows: updatedGridData, gridRows: sliceData || [], currentPage: 0,
                    gridCount: gridCount, gridPagination: pagination, openForm: false, editRowData: {}, actionType: '' });
            } else if (pagination) {
                setCommonState({ ...commonState, allGridRows: updatedGridData, gridRows: updatedGridData || [], openForm: false, editRowData: {}, actionType: '' });
            } else {
                let startPageLimit = commonState.currentPage * commonState.perPageCount;
                let endPageLimit = startPageLimit + commonState.perPageCount;
                let sliceData = updatedGridData.slice(startPageLimit, endPageLimit);
                setCommonState({ ...commonState, allGridRows: updatedGridData, gridRows: sliceData || [], openForm: false, editRowData: {}, actionType: '' });
            }
        } else {
            setCommonState({ ...commonState, openConfirm: false, editRowData: {}, actionType: ''});
        }
    }

    const columns: MUIDataTableColumn[] = [
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
            label: 'Part Number'
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
            name: 'salePrice',
            label: 'Sale Price',
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
                setCellProps: () => ({
                    style: {
                        whiteSpace: "nowrap",
                        position: "sticky",
                        left: "0",
                        // background: "white",
                        zIndex: 100
                    }
                }),
                setCellHeaderProps: () => ({
                    style: {
                        whiteSpace: "nowrap",
                        position: "sticky",
                        left: 0,
                        background: "white",
                        zIndex: 101
                    }
                })
            }
        }
    ];

    const options: MUIDataTableOptions = {
        filter: true,
        search: true,
        selectableRowsHideCheckboxes: true,
        download: false,
        print: false,        
        page: commonState.currentPage,
        pagination: true,
        rowsPerPage: commonState.perPageCount,
        rowsPerPageOptions: [commonState.perPageCount],
        serverSide: true,
        count: commonState.gridCount,
        onTableChange: (action, tableState) => {
            if (action === "changePage") {
                if (commonState.gridPagination) {
                    changePage(tableState.page);
                } else {
                    let startPageLimit = tableState.page * commonState.perPageCount;
                    let endPageLimit = startPageLimit + commonState.perPageCount;
                    let sliceData = commonState.allGridRows.slice(startPageLimit, endPageLimit);
                    setCommonState({ ...commonState, gridRows: sliceData || [], currentPage: tableState.page});
                }
            }
        },
        onSearchChange: (searchText) => {
            if (searchText) {
                changePage(0, {}, {caller: 'prodSearch', searchText: searchText});
            } else {
                changePage(0, {}, {caller: '', searchText: ''});
            }
        },
        onColumnSortChange: (changedColumn, direction) => {
            changePage(0, {}, {caller: 'sort', sortColumn: changedColumn, sortDirection: direction});
        }
    }

    const changePage = (page: number, concatObj?: any, callerObj?: object) => {
        let filterObj = callerObj;
        if (isNullOrUndefinedOrEmpty(filterObj)) {
            if (commonState.caller === 'prodSearch') {
                filterObj = { caller: commonState.caller, searchText: commonState.searchText };
            } else if (commonState.caller === 'sort') {
                filterObj = { caller: commonState.caller, sortColumn: commonState.changedColumn, sortDirection: commonState.direction };
            }
        }
        let putData = {
            startPageLimit: page * commonState.perPageCount,
            endPageLimit: commonState.perPageCount,
            maxRowLimit: commonState.maxRowLimit,
            ...filterObj
        };
        props.dispatch(apiActions.methodAction('put', PRODUCTAPI().GETPRODUCT, putData, (result: IAPIReponse) => {
            let gridRows = result.data;
            if (result.pagination === 0) {
                gridRows = gridRows.slice(putData.startPageLimit, (putData.startPageLimit + putData.endPageLimit));   
            }
            setCommonState({ ...commonState, allGridRows: result.data, gridRows: gridRows || [],
                gridCount: result.count, gridPagination: result.pagination, currentPage: page,
                ...concatObj, ...filterObj
            });
        }));
    };

    return <div className="p-3">
        <div style={{display: commonState.openForm ? "none" : "block"}}>
            <div className="d-flex py-2">
                <h6 className="col px-0 py-1">Product List</h6>
                <Button variant="contained" color="primary" onClick={() => {
                    setCommonState({ ...commonState, openForm: true });
                    setState({ partNumber: '', productName: '', uom: 'count', gst: '0', productType: 0, salePrice: 0, productDescription: '' });
                }}><AddIcon/>Add New</Button>
            </div>
            <MUIDataTable
                title={""}
                data={commonState.gridRows}
                columns={columns}
                options={options}
                />
        </div>
        <div style={{display: commonState.openForm ? "block" : "none"}}>
            <div className="py-2">
                <h6>{commonState.actionType === "edit" ? "Edit Product" : "Add New Product"}</h6>
            </div>
            <form action="" autoComplete="off" className="">
                <div className="row">
                    <div className="col-12 col-sm-3 pb-4">
                        <DropDownView label="Type" type={'text'} field={'productType'} className={'col-12 '} required
                            onChange={handleChange} value={state.productType} dataSource={ProductType}
                            fields={{text: 'text', value: 'value'}} variant="standard"></DropDownView>
                    </div>
                    <div className="col-12 col-sm-3 pb-4">
                        <TextFieldView label="Part Number" type={'text'} field={'partNumber'} className={'col-12 '} required
                            onChange={handleChange} value={state.partNumber} />
                    </div>
                    <div className="col-12 col-sm-6 pb-4">
                        <TextFieldView label="Product Name/Service Name" type={'text'} field={'productName'} className={'col-12 '} required
                            onChange={handleChange} value={state.productName} />
                    </div>
                    <div className="col-12 pb-4">
                        <TextFieldView label="Product Description" type={'text'} field={'productDescription'} className={'col-12 col-sm-12'}
                            onChange={handleChange} value={state.productDescription} multiline={true} />
                    </div>
                    {!state.productType && <><div className="col-12 col-sm-6 pb-4">
                        <DropDownView label="UOM" type={'text'} field={'uom'} className={'col-12 '} required
                            onChange={handleChange} value={state.uom} dataSource={uomList}
                            fields={{text: 'text', value: 'value'}} variant="standard"></DropDownView>
                    </div>
                    <div className="col-12 col-sm-6 pb-4">
                        <DropDownView label="GST" type={'text'} field={'gst'} className={'col-12 '} required
                            onChange={handleChange} value={state.gst} dataSource={TaxData}
                            fields={{text: 'text', value: 'value'}} variant="standard"></DropDownView>
                    </div></>}
                    <div className="col-12 col-sm-6 pb-4">
                        <TextFieldView label="Sale Price" type={'number'} field={'salePrice'} className={'col-12 '} required
                            onChange={handleChange} value={state.salePrice} />
                    </div>
                    <div className="row m-0">
                        <div className="col-6 col-sm-6 p-0">
                            <Button variant="contained" color="secondary" onClick={() => {
                            setCommonState({ ...commonState, openForm: false });
                            setState({ partNumber: '', productName: '', uom: 'count', gst: '0', salePrice: 0, productDescription: '' });
                            }}>Cancel</Button>
                        </div>
                        <div className="col-6 col-sm-6 p-0" align="right">
                            <Button variant="contained" color="primary" onClick={() => submit()}>Save</Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <Dialog open={commonState.openConfirm} onClose={() => stateReset()}>
            <DialogTitle>{"Do you want to delete the product?"}</DialogTitle>
            <DialogActions className="pb-3">
                <Button variant="contained" color="primary" onClick={() => prodDelete()}>Yes</Button>
                <Button onClick={() => stateReset()} autoFocus>No</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Product);