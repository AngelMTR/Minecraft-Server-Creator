// import { Router, Link } from "preact-router"
import Header from "@/components/Header.jsx";
import Nav from "@/components/Nav.jsx";
import Contant from "@/components/Contant.jsx";
import Footer from "@/components/Footer.jsx";
// import Counter from "@/components/Counter.jsx"

function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <div className="flex flex-1">
                <Nav/>
                <Contant />
            </div>
            {/*<Counter />*/}
            <Footer/>
        </div>
    )
}

export default Layout;