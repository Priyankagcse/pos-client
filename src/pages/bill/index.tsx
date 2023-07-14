import { Autocomplete, Button, TextField } from "@mui/material";
import React, {useState } from "react";
import { TextFieldView } from "src/component/textfield-view";
import { Columns } from "./config/config";
import 'dayjs/locale/de';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MUIDataTable from "mui-datatables";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

function Bill () {
    let [state, setState] = useState({} as any);
    let [addProduct, setAddProduct] = useState(false);
    const handleChange = (field: any, value: any) => {
        setState((prevState: any) => ({
            ...prevState,
            [field]: value
        }));
    };

    return <div>
        <div className="py-2">
            <h6>New Bill</h6>
        </div>
        <div className="row bg-light p-2">
            <div className={"col-12 p-2 row " + (addProduct ? "col-sm-9" : "col-sm-12")}>
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
                        options={{}}
                    />
                    <Button onClick={() => setAddProduct(true)}>Add Product</Button>
                </div>
            </div>
            {addProduct && <div className="col-12 col-sm-3 p-2">
                
                <div className="d-flex">
                    <Button onClick={() => setAddProduct(false)}>Cancel</Button>
                    <Button onClick={() => setAddProduct(true)}>Add</Button>
                </div>
            </div> }
        </div>
    </div>;
}

export default Bill;