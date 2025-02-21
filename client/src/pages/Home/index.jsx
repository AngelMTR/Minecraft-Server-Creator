import { h } from 'preact';
import Header from "@/components/Header.jsx";
import Menu from "@/components/Menu.jsx";

const Home = () => {
    return (
        <>
            <div className="min-h-screen w-full">
                <Header />
                <div className="flex">
                    <div className="bg-red-900 basis-1/10">
                        <Menu/>
                    </div>
                    <div className="bg-blue-900 basis-9/10">
                        Content
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home