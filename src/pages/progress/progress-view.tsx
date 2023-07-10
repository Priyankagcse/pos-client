import { CircularProgress } from "@mui/material";
import React from "react";

export function ProgressView(props: any) {
    return (<>
        {props.isProgress ? <div className="a-progress-center">
            <CircularProgress></CircularProgress>
        </div> : <></>}
    </>);
}