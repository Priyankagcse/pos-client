import React, { useEffect } from "react";
// import { SigninPageView } from "./login/signin-view";
import { connect } from "react-redux";
import { IState } from "src/initialload/state-interface";
import { Dispatch } from "redux";
import { apiActions } from "src/action/action";
import { COMMONAPI } from "src/apiurl";
// import { AlertPage } from "./alert/alertpage-view";
// import { ProgressView } from "./progress/progress-view";
// import { alertAction } from "./alert/alert-reducer";

function ClientApp(props: any) {

    const [state, setState] = React.useState({userList: []});

    const handleChange = (field: any, value: any) => {
        setState((prevState: any) => ({
            ...prevState,
            [field]: value
        }));
    };

    useEffect(() => {
        props.dispatch(apiActions.methodAction('get', COMMONAPI().GET, {}, (result: any) => {
            handleChange('userList', result.data);
        }));
    }, []);

    return (<>
        {/* <AlertPage
            onClose={() => props.dispatch(alertAction.clear())}
            open={props.message}
            autoHideDuration={3000}
            message={props.message}
        />
        <ProgressView isProgress={props.isProgress}></ProgressView>
        <div className={props.isProgress ? "a-opacity-disable h-100" : "h-100"}>
            <SigninPageView></SigninPageView>
        </div> */}
        {state.userList.map((line: any) => {
            return <div>
                {line.username}
            </div>;
        })}
    </>);
}

const mapStateToProps = function(state: IState) {
    return {
        message: state.alertReducer.message,
        isProgress: state.progress.isProgress
    };
};

const mapDispatchToProps = function(dispatch: Dispatch) {
    return {
        dispatch: dispatch
    };
};

export const ClientAppView = connect(mapStateToProps, mapDispatchToProps)(ClientApp);