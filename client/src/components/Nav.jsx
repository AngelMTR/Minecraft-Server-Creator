import { h } from 'preact';
import Router, {Link} from "preact-router";
const Nav = () => {
    return (
        <>
            <aside className="w-1/10 bg-gray-800 p-4">
                <nav>
                    <ul>
                        <li className="mb-2">
                            <Link className="text-blue-500 hover:underline" href="/console">Console</Link>
                        </li>
                        <li className="mb-2">
                            <Link className="text-blue-500 hover:underline" href="/log">Log</Link>
                        </li>
                        <li>
                            <Link className="text-blue-500 hover:underline" href="/servers">Servers</Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Nav