import { h } from 'preact';
import {Router} from "preact-router";
import Console from "@/modules/Console.jsx";
import Log from "@/modules/Log.jsx";
import Servers from "@/modules/Servers.jsx";

const Contant = () => {
    return (
        <main className="flex-1 p-4">
            <Router>
                <Console path="/console"/>
                <Log path="/log"/>
                <Servers path="/servers"/>
            </Router>
        </main>
    )
}

export default Contant