import React from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";

function commonTemp(props: any) {
    return (<>
        Menus
    </>);
}

const mapStateToProps = function(state: IState) {
    return {
        
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const commonView = connect(mapStateToProps, mapDispatchToProps)(commonTemp);