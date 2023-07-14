import React, { useState } from "react";
import { Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Route, Router, Switch } from "react-router";
import { HomeRouter } from "src/initialload/router";
import { history } from "../../helper/history";
import { getMenuIcon } from "./config/config";
import { loginAction } from "src/pages/login/login-reducer";

function Layout({children, menus, props}: any) {
    let [show, setShow] = useState(false);
    let [selectedMenu, setMenu] = useState({} as any);
    const menuClick = (menu: any) => {
        if (menu.menuName === 'Logout') {
            props.dispatch(loginAction.homeToLogin(true));
            setMenu(menu);
        } else {
            history.push(menu.pathTemplate)
            setMenu(menu);
        }
    };

    return <>
        <header className="sticky-top bg-gray flex-md-nowrap p-0 shadow bg-white">
            <Button data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation" onClick={() => setShow(true)}>
                <MenuIcon ></MenuIcon>
            </Button>
            <a href="#" className="navbar-brand col-md-3 col-lg-2 me-0 p-2 fs-6 ">Company Name</a>
        </header>
        <div className="container-fluid" style={{height: 'calc(100% - 36px)'}}>
            <div className="row h-100">
                <div className="sidebar col-md-3 col-lg-2 p-0 bg-body-tertiary h-100 overflow-auto">
                    <div className={"offcanvas-lg offcanvas-start bg-body-tertiary h-100 " + (show ? "show" : "")}
                        tabIndex={-1} id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="sidebarMenuLabel">Company name</h5>
                            <Button type="button" className="btn-close" data-bs-dismiss="offcanvas"
                                data-bs-target="#sidebarMenu" aria-label="Close" onClick={() => setShow(false)}></Button>
                        </div>
                        <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto h-100">
                            <ul className="nav flex-column h-100">
                                {menus.map((menu: any, index: number) => {
                                    let Icon = getMenuIcon(menu.menuName);
                                    let menuClass = "nav-item " + (menu.menuName === selectedMenu.menuName ? "active" : "");
                                    if (menu.menuName === 'Empty') {
                                        menuClass += ' flex-grow-1 invisible';
                                    }
                                    return <li key={index} className={menuClass}
                                        onClick={() => menuClick(menu)}>
                                        <div className="nav-link d-flex align-items-center gap-2">
                                            <Icon></Icon>
                                            {menu.displayName}
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 h-100 overflow-auto">
                    <Router history={history}>
                        <Switch>
                            <Route path="/home/:anyLink" component={HomeRouter} />
                        </Switch>
                    </Router>
                </main>
            </div>
        </div>
    </>;
}

export default Layout;