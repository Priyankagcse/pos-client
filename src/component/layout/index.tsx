import React, { useState } from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

function Layout({children}: any) {
    let [show, setShow] = useState(false);

    return <>
        <header className="sticky-top bg-gray flex-md-nowrap p-0 shadow bg-white">
            <Button data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation" onClick={() => setShow(true)}>
                <MenuIcon ></MenuIcon>
            </Button>
            <a href="#" className="navbar-brand col-md-3 col-lg-2 me-0 p-2 fs-6 ">Company Name</a>
        </header>
        <div className="container-fluid h-100">
            <div className="row h-100">
                <div className="sidebar col-md-3 col-lg-2 p-0 bg-body-tertiary">
                    <div className={"offcanvas-lg offcanvas-start bg-body-tertiary " + (show ? "show" : "")} tabIndex={-1} id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="sidebarMenuLabel">Company name</h5>
                            <Button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close" onClick={() => setShow(false)}></Button>
                        </div>
                        <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a href="#" className="nav-link d-flex align-items-center gap-2">
                                        <DashboardIcon></DashboardIcon>
                                        Dashboard
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    {children}
                </main>
            </div>
        </div>
    </>;
}

export default Layout;