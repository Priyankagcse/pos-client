import React from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { MenuPageView } from "./menulists/menus-view";
import { ChartView } from "./chart";

function HomePage(props: any) {
    return (<>
        <MenuPageView />
        <ChartView></ChartView>
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

export const HomePageView = connect(mapStateToProps, mapDispatchToProps)(HomePage);