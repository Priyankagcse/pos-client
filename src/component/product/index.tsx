import React, {useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { TextFieldView } from "../textfield-view";
import { apiActions } from "src/action/action";
import { PRODUCTAPI } from "src/apiurl";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { DropDownView } from "../dropdown-view";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

let taxData = [
    { text: '0%', value: '0' },
    { text: '5%', value: '5' },
    { text: '12%', value: '12' },
    { text: '18%', value: '18' },
    { text: '28%', value: '28' }
];

function Product(props: any) {
    let [state, setState] = useState({} as any);
    let [commonState, setCommonState] = useState({openConfirm: false, gridRows: [], editRowData: {}, actionType: '', openForm: false} as any);
    const handleChange = (field: any, value: any) => {
        setState((prevState: any) => ({
            ...prevState,
            [field]: value
        }));
    };

    useEffect(() => {
        props.dispatch(apiActions.methodAction('get', PRODUCTAPI(props.loginCurrentUser.companyUuid).GET, {}, (result: any) => {
            setCommonState({ ...commonState, gridRows: result.data || []});
        }));
    }, []);

    const submit = () => {
        let productObj = { ...state };
        if (commonState.actionType === 'edit') {
            productObj['uuid'] = commonState.editRowData.uuid;
            props.dispatch(apiActions.methodAction('put', PRODUCTAPI().PUT, productObj, (res: any) => {
                let updatedGridData = commonState.gridRows.map((gridLine: any, ind: number) => {
                    if (gridLine.uuid === commonState.editRowData.uuid) {
                        return res.data;
                    }
                    return gridLine;
                });
                stateReset(updatedGridData);
            }));
        } else {
            props.dispatch(apiActions.methodAction('post', PRODUCTAPI().POST, productObj, (res: any) => {
                let updatedGridData = commonState.gridRows.concat([res.data]);
                stateReset(updatedGridData);
            }));
        }
    }

    const onButtonClick = (event: any, rowData: any, flag: string) => {
        if (flag === 'edit') {
            setCommonState({ ...commonState, openForm: true, editRowData: rowData, actionType: 'edit'});
            setState({ partNumber: rowData.partNumber, productName: rowData.productName, gst: rowData.gst,
                price: rowData.price, productDescription: rowData.productDescription });
        } else {
            setCommonState({ ...commonState, openConfirm: true, editRowData: rowData, actionType: 'delete'});
        }
    }

    const prodDelete = () => {
        props.dispatch(apiActions.methodAction('delete', PRODUCTAPI().DELETE, {uuid: commonState.editRowData.uuid}, (result: any) => {
            let filterData = commonState.gridRows.filter((gridLine: any) => gridLine.uuid !== commonState.editRowData.uuid);
            setCommonState({ ...commonState, openConfirm: false, editRowData: {}, actionType: '', gridRows: filterData || []});
        }));
    }

    const stateReset = (updatedGridData?: any) => {
        if (updatedGridData) {
            setCommonState({ ...commonState, openForm: false, editRowData: {}, actionType: '', gridRows: updatedGridData || []});
        } else {
            setCommonState({ ...commonState, openConfirm: false, editRowData: {}, actionType: ''});
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'partNumber',
            headerName: 'Part Number',
            width: 150,
            editable: true,
        },
        {
            field: 'productName',
            headerName: 'Product Name',
            width: 250,
            editable: true,
        },
        {
            field: 'gst',
            headerName: 'GST',
            width: 150,
            editable: true,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.gst || ''}%`,
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 150,
            editable: true,
        },
        {
            field: 'productDescription',
            headerName: 'Product Description',
            width: 250,
            editable: true,
        },
        {   field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => {
                return (<>
                    <Button onClick={(e) => onButtonClick(e, params.row, 'edit')}>
                    <EditIcon></EditIcon>
                    </Button>
                    <Button onClick={(e) => onButtonClick(e, params.row, 'delete')}>
                    <DeleteIcon></DeleteIcon>
                    </Button>
                </>);
            }
        }
    ];

    return <div className="p-3">
        <div style={{display: commonState.openForm ? "none" : "block"}}>
            <div className="row m-0">
                <h6>Product List</h6>
                <Button onClick={() => {
                    setCommonState({ ...commonState, openForm: true });
                    setState({ partNumber: '', productName: '', gst: '', price: '', productDescription: '' });
                }}>Add New</Button>
            </div>
            <DataGrid getRowId={(row) => row.uuid}
                rows={commonState.gridRows}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    }
                }
                }}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
            />
        </div>
        <div style={{display: commonState.openForm ? "block" : "none"}}>
            <form action="" autoComplete="off" className="">
                <div className="headingsContainer">
                    <h3 align="center">Add New Product</h3>
                </div>
                <div className="mainContainer">                
                    <TextFieldView label="Part Number" type={'text'} field={'partNumber'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.partNumber} />
                    <br /><br />
                    <TextFieldView label="Product Name" type={'text'} field={'productName'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.productName} />
                    <br /><br />
                    <DropDownView label="GST" type={'text'} field={'gst'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.gst} dataSource={taxData}
                        fields={{text: 'text', value: 'value'}} variant="standard"></DropDownView>
                    <br /><br />
                    <TextFieldView label="Price" type={'number'} field={'price'} className={'col-12 col-sm-12'} required
                        onChange={handleChange} value={state.price} />
                    <br /><br />
                    <TextFieldView label="Product Description" type={'text'} field={'productDescription'} className={'col-12 col-sm-12'}
                        onChange={handleChange} value={state.productDescription} multiline={true} rows={4} />
                    <br /><br />
                    <div className="row m-0">
                        <div className="col-6 col-sm-6 p-0">
                            <Button variant="contained" color="primary" onClick={() => {
                            setCommonState({ ...commonState, openForm: false });
                            setState({ partNumber: '', productName: '', gst: '', price: '', productDescription: '' });
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
            <DialogTitle>{"Do you want to Delete the Product?"}</DialogTitle>
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