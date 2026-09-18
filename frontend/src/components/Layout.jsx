import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

const Layout = () => {

    const [searchValue,setSearchValue] = useState("");
    return (
        <div className="min-h-screen bg-slate-50">

            <Sidebar />

            <div className="ml-64">

                <Header onSearch={setSearchValue}/>

                <main className="p-6">
                    <Outlet context={{searchValue}}/>
                </main>

            </div>

        </div>
    );
};

export default Layout;