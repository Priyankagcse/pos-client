// import DateFnsUtils from '@date-io/date-fns';
// import { Grid } from '@mui/material';
// import React from "react";
// import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

// export function DatePickerView(props: any) {
//     return (<>
//         <MuiPickersUtilsProvider utils={DateFnsUtils}>
//             <Grid container justifyContent="space-around">
//                 <KeyboardDatePicker margin="normal" label={props.label} format={props.format} variant="inline"
//                     value={props.value} className={props.className} KeyboardButtonProps={{'aria-label': 'change date'}} disableToolbar
//                     onChange={(value: any) => props.onChange(props.field, value)} autoOk={true} inputProps={{readOnly: true}}
//                     required={props.required} minDate={props.minDate} disabled={props.disabled} />
//             </Grid>
//         </MuiPickersUtilsProvider>
//     </>);
// }