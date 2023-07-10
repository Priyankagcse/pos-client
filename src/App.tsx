import * as React from 'react';
import './global';
import { Provider } from 'react-redux';
import { ClientAppView } from './pages/clientapp-view';
import { rootReducer } from './initialload/root-reducer';
import { IState } from './initialload/state-interface';
import './styles/common.scss';
import './styles/material-common.scss';
import './styles/fabric.scss';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material';
import { theme } from './commontheme-css';
// import { createStore, applyMiddleware } from 'redux';
// import thunkMiddleware from 'redux-thunk';

// "@material-ui/core": "^4.12.4",
// "@material-ui/icons": "^4.11.3",
// "@material-ui/lab": "^4.0.0-alpha.61",
// "@material-ui/pickers": "^3.3.10",
// "@material-ui/styles": "^4.11.5",
// "react-material-ui-form-validator": "^3.0.1",

declare module 'react' {
    interface HTMLAttributes<T> {
        uid?: string;
        align?: string;
        indeterminate?: boolean;
    }
}

export function App() {
    return (
        <ThemeProvider theme={theme}>
            <ClientAppView></ClientAppView>
        </ThemeProvider>
    );
}

// let stringData = localStorage.getItem(`nila-${localStorage.getItem('loginUser')}`);
// let previousData: IState = {} as IState;
// if (stringData) {
//     try {
//         previousData = JSON.parse(stringData) || {};
//     } catch {
//         previousData = {} as IState;
//     }
// }

// export const store = createStore(
//     rootReducer,
//     {} || previousData,
//     applyMiddleware(thunkMiddleware)
// );

export const store = configureStore({reducer: rootReducer});

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<Provider store={store}>
    <App />
</Provider>)

function saveonClose() {
    saveLocalData();
    window.removeEventListener('beforeunload', saveonClose);
}

window.addEventListener('beforeunload', saveonClose);

window.onerror = () => {
    localStorage.removeItem(`nila-${localStorage.getItem('loginUser')}`);
};

function saveLocalData() {
    let state: IState = store.getState() as IState;
    if (state.loginUser.loggingIn) {
        saveData(store.getState() as IState);
    }
}

// registerServiceWorker.register();

export function saveData(state: object) {
    try {
        localStorage.setItem(`nila-${localStorage.getItem('loginUser')}`, stringifyData(state));
    } catch {
        console.log('Backup Failed');
    }
}

export function stringifyData(state: object) {
    let currentData = '';
    try {
        currentData = JSON.stringify(state, (key: string, value: object) => {
            return value;
        });
    } catch {
        currentData = '';
    }
    return currentData;
}