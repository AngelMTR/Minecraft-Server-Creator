import { useState } from 'preact/hooks'
import './app.css'
import Home from "@/pages/Home/index.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Router from "preact-router";

export function App() {
  // const [count, setCount] = useState(0)

  return (
      <>
        <div>
            <Router>
                <Home path="/" />
                <NotFound default />
            </Router>
        </div>
      </>
  )
}
