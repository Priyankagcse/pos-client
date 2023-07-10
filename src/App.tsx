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

export const store = configureStore({reducer: rootReducer});

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<Provider store={store}>
    <App />
</Provider>);

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