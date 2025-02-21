import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import Dashboard from "@/pages/Dashboard/index.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Router from "preact-router";

export function App() {
  // const [count, setCount] = useState(0)

  return (
      <>
        <div>
            <Router>
                <Dashboard path="/" />
                <NotFound default />
            </Router>
        </div>
      </>
  )
}
