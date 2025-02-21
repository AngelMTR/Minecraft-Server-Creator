import {useState} from 'preact/hooks'
import './app.css'
import Home from "@/pages/Home/index.jsx";
import NotFound from "@/pages/NotFound.jsx";

export function App() {
    // const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <Home path="/"/>
                <NotFound default/>
            </div>
        </>
    )
}
