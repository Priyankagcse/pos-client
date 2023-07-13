import React, {useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Button } from "@mui/material";
import { TextFieldView } from "../textfield-view";

function Product(){
  let [openForm, setOpenForm] = useState(false);
  let [state, setState] = useState({} as any);
  const handleChange = (field: any, value: any) => {
      setState((prevState: any) => ({
          ...prevState,
          [field]: value
      }));
  };

  const submit = () => {
    //
  }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'firstName',
          headerName: 'First name',
          width: 150,
          editable: true,
        },
        {
          field: 'lastName',
          headerName: 'Last name',
          width: 150,
          editable: true,
        },
        {
          field: 'age',
          headerName: 'Age',
          type: 'number',
          width: 110,
          editable: true,
        },
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params: GridValueGetterParams) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];
      
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    return <div className="p-3">
      <div style={{visibility: openForm ? "hidden" : "visible"}}>
        <div className="row m-0">
          <h6>Product List</h6>
          <Button onClick={() => setOpenForm(true)}>Add New</Button>
        </div>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
        />
      </div>
        <div style={{visibility: openForm ? "visible" : "hidden"}}>
          <form action="" autoComplete="off" className="">
            <div className="headingsContainer">
                <h3 align="center">Sign Up</h3>
            </div>
            <div className="mainContainer">
                <TextFieldView label="Username" type={'text'} field={'username'} className={'col-12 col-sm-12'} required
                    onChange={handleChange} value={state.username} />
                <br /><br />
                <TextFieldView label="Password" type={'password'} field={'password'} className={'col-12 col-sm-12'} required
                    onChange={handleChange} value={state.password} placeholder={'Aa@12345'} />
                <br /><br />
                <TextFieldView label="Phone Number" type={'number'} field={'phoneNumber'} className={'col-12 col-sm-12'} required
                    onChange={handleChange} value={state.phoneNumber} inputProps={{maxLength: 10}} placeholder={'9874563210'} />
                <br /><br />
                <TextFieldView label="Email" type={'email'} field={'email'} className={'col-12 col-sm-12'} required
                    onChange={handleChange} value={state.email} placeholder={'abc@gmail.com'} />
                <br /><br />
                <div className="row m-0">
                    <div className="col-6 col-sm-6 p-0">
                        <Button variant="contained" color="primary">Cancel</Button>
                    </div>
                    <div className="col-6 col-sm-6 p-0" align="right">
                        <Button variant="contained" color="primary" onClick={() => submit()}>Save</Button>
                    </div>
                </div>
            </div>
        </form>
        </div>
    </div>;
}

export default Product;