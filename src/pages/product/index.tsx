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
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions } from "mui-datatables";
import AddIcon from '@mui/icons-material/Add';

let taxData = [
    { text: '0%', value: '0' },
    { text: '5%', value: '5' },
    { text: '12%', value: '12' },
    { text: '18%', value: '18' },
    { text: '28%', value: '28' }
];

export let uomList = [
    { text: 'Count', value: 'count' }
];

function Product(props: any) {
    let [state, setState] = useState({uom: 'count', gst: '0'} as any);
    let [commonState, setCommonState] = useState({openConfirm: false, gridRows: [], editRowData: {}, actionType: '',
        openForm: false, perPageCount: 3, gridCount: 0, gridPagination: -1, allGridRows: [], maxRowLimit: 5, currentPage: 0} as any);
    const handleChange = (field: any, value: any) => {
        setState((prevState: any) => ({
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
            props.dispatch(apiActions.methodAction('put', PRODUCTAPI().PUT, productObj, (res: any) => {
                let updatedGridData = commonState.allGridRows.map((gridLine: any, ind: number) => {
                    if (gridLine.uuid === commonState.editRowData.uuid) {
                        return res.data;
                    }
                    return gridLine;
                });
                stateReset(updatedGridData, 'edit');
            }));
        } else {
            props.dispatch(apiActions.methodAction('post', PRODUCTAPI().POST, productObj, (res: any) => {
                commonState.allGridRows.unshift(res.data);
                stateReset(commonState.allGridRows, 'add');
            }));
        }
    }

    const onButtonClick = (event: any, uuid: string, flag: string) => {
        let filterData = commonState.gridRows.find((gridLine: any) => gridLine.uuid === uuid);
        if (flag === 'edit') {
            setCommonState({ ...commonState, openForm: true, editRowData: filterData, actionType: 'edit'});
            setState({ partNumber: filterData.partNumber, productName: filterData.productName, uom: filterData.uom, gst: filterData.gst,
                price: filterData.price, productDescription: filterData.productDescription });
        } else {
            setCommonState({ ...commonState, openConfirm: true, editRowData: filterData, actionType: 'delete'});
        }
    }

    const prodDelete = () => {
        props.dispatch(apiActions.methodAction('delete', PRODUCTAPI().DELETE, {uuid: commonState.editRowData.uuid}, (result: any) => {
            let filterData = commonState.allGridRows.filter((gridLine: any) => gridLine.uuid !== commonState.editRowData.uuid);
            let sliceData = filterData.slice(commonState.currentPage, commonState.perPageCount);
            let pagination = 0;
            let gridCount = commonState.gridCount - 1;
            if (gridCount > commonState.maxRowLimit) {
                pagination = 1;
            }
            setCommonState({ ...commonState, openConfirm: false, editRowData: {}, actionType: '',
                allGridRows: filterData, gridRows: sliceData || [], gridCount: gridCount, gridPagination: pagination});
        }));
    }

    const stateReset = (updatedGridData?: any, flag?: string) => {        
        if (updatedGridData) {
            if (flag === 'add') {
                let pagination = 0;
                let gridCount = commonState.gridCount + 1;
                if (gridCount > commonState.maxRowLimit) {
                    pagination = 1;
                }
                let sliceData = updatedGridData.slice(0, commonState.perPageCount);
                setCommonState({ ...commonState, allGridRows: updatedGridData, gridRows: sliceData || [],
                    gridCount: gridCount, gridPagination: pagination, openForm: false, editRowData: {}, actionType: '' });
            } else {
                let sliceData = updatedGridData.slice(commonState.currentPage, commonState.perPageCount);
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
        {   name: 'actions', label: 'Actions',
            options: {
                filter: false, sort: false,
                customBodyRender: (value: string, tableMeta: any) => {
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
        }
    }

    const changePage = (page: any) => {
        let putData = {
            companyUuid: props.loginCurrentUser.companyUuid,
            startPageLimit: page * commonState.perPageCount,
            endPageLimit: commonState.perPageCount,
            maxRowLimit: commonState.maxRowLimit
        };
        props.dispatch(apiActions.methodAction('put', PRODUCTAPI().GETPRODUCT, putData, (result: any) => {
            let gridRows = result.data;
            if (result.pagination === 0) {
                gridRows = gridRows.slice(putData.startPageLimit, (putData.startPageLimit + putData.endPageLimit));   
            }
            setCommonState({ ...commonState, allGridRows: result.data, gridRows: gridRows || [],
                gridCount: result.count, gridPagination: result.pagination, currentPage: page });
        }));
    };

    return <div className="p-3">
        <div style={{display: commonState.openForm ? "none" : "block"}}>
            <div className="d-flex py-2">
                <h6 className="col px-0 py-1">Product List</h6>
                <Button variant="contained" color="primary" onClick={() => {
                    setCommonState({ ...commonState, openForm: true });
                    setState({ partNumber: '', productName: '', uom: 'count', gst: '0', price: '', productDescription: '' });
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
                    <div className="col-12 col-sm-6 pb-4">
                        <TextFieldView label="Part Number" type={'text'} field={'partNumber'} className={'col-12 '} required
                            onChange={handleChange} value={state.partNumber} />
                    </div>
                    <div className="col-12 col-sm-6 pb-4">
                        <TextFieldView label="Product Name" type={'text'} field={'productName'} className={'col-12 '} required
                            onChange={handleChange} value={state.productName} />
                    </div>
                    <div className="col-12 pb-4">
                        <TextFieldView label="Product Description" type={'text'} field={'productDescription'} className={'col-12 col-sm-12'}
                            onChange={handleChange} value={state.productDescription} multiline={true} />
                    </div>
                    <div className="col-12 col-sm-6 pb-4">
                        <DropDownView label="UOM" type={'text'} field={'uom'} className={'col-12 '} required
                            onChange={handleChange} value={state.uom} dataSource={uomList}
                            fields={{text: 'text', value: 'value'}} variant="standard"></DropDownView>
                    </div>
                    <div className="col-12 col-sm-6 pb-4">
                        <DropDownView label="GST" type={'text'} field={'gst'} className={'col-12 '} required
                            onChange={handleChange} value={state.gst} dataSource={taxData}
                            fields={{text: 'text', value: 'value'}} variant="standard"></DropDownView>
                    </div>
                    <div className="col-12 col-sm-6 pb-4">
                        <TextFieldView label="Price" type={'number'} field={'price'} className={'col-12 '} required
                            onChange={handleChange} value={state.price} />
                    </div>
                    <div className="row m-0">
                        <div className="col-6 col-sm-6 p-0">
                            <Button variant="contained" color="secondary" onClick={() => {
                            setCommonState({ ...commonState, openForm: false });
                            setState({ partNumber: '', productName: '', uom: 'count', gst: '0', price: '', productDescription: '' });
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