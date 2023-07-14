import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { isNullOrUndefinedOrEmpty } from "src/common";
import { history } from "src/helper/history";
import { loginAction } from "./login/login-reducer";
import Layout from "src/component/layout";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import Product from "src/pages/product";
// import { MenuPageView } from "./menulists/menus-view";
// import { AppBarView } from "src/component/appbar-view";

function HomePage(props: any) {

    useEffect(() => {
        return () => {
            let urlName = window.location.href;
            if (!isNullOrUndefinedOrEmpty(urlName)) {
                let urlArrList = urlName.split('/');
                if (urlArrList.length) {
                    let getLastPathName = urlArrList[urlArrList.length - 1];
                    if (!isNullOrUndefinedOrEmpty(getLastPathName)) {
                        if (getLastPathName === 'login') {
                            history.push('/home');
                            props.dispatch(loginAction.homeToLogin(true));
                        } else if (getLastPathName === 'home') {
                            history.push('/login');
                            props.dispatch(loginAction.homeToLogin(false));
                        }
                    }
                }
            }
        }
    }, []);

    return (<>
        {/* <AppBarView></AppBarView> */}
        <Layout
            menus={props.menus}
        >
            <Product></Product>
        </Layout>
        <Dialog open={props.isConfirm} onClose={() => props.dispatch(loginAction.homeToLogin(false))}
            aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle>{"Do you want to logout?"}</DialogTitle>
            <DialogActions className="pb-3">
                <Button variant="contained" color="primary" onClick={() => {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('userUuid');
                    props.dispatch(loginAction.logoutRequest());
                }}>Ok</Button>
                <Button onClick={() => props.dispatch(loginAction.homeToLogin(false))} autoFocus>Cancel</Button>
            </DialogActions>
        </Dialog>
    </>);
}

const mapStateToProps = function(state: IState) {
    return {
        isConfirm: state.loginUser.isHomeToLogin,
        menus: state.menuList.menus
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const HomePageView = connect(mapStateToProps, mapDispatchToProps)(HomePage);