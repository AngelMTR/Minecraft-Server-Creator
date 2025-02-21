import { h } from 'preact';
import {Router} from "preact-router";
import Console from "@/modules/Console.jsx";
import Log from "@/modules/Log.jsx";
import Servers from "@/modules/Servers.jsx";
import Access from "@/modules/Access.jsx";
import Backups from "@/modules/Backups.jsx";
import Files from "@/modules/Files.jsx";
import Options from "@/modules/Options.jsx";
import Players from "@/modules/Players.jsx";
import Server from "@/modules/Server.jsx";
import Software from "@/modules/Software.jsx";
import Worlds from "@/modules/Worlds.jsx";

const Contant = () => {
    return (
        <main className="flex-1 p-4">
            <Router>
                <Access path="/access"/>
                <Backups path="/backups"/>
                <Console path="/console"/>
                <Files path="/files"/>
                <Log path="/log"/>
                <Options path="/options"/>
                <Players path="/players"/>
                <Server path="/server"/>
                <Servers path="/servers"/>
                <Software path="/software"/>
                <Worlds path="/worlds"/>
            </Router>
        </main>
    )
}

export default Contant