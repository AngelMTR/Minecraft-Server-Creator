import { h } from 'preact';
import Header from "@/components/Header.jsx";
import Menu from "@/components/Menu.jsx";

const Home = () => {
    return (
        <>
            <div className="min-h-screen w-full">
                <Header />
                <div className="flex min-h-screen">
                    <div className="bg-red-900 basis-1/10 p-4 flex flex-col items-center">
                        <Menu/>
                    </div>
                    <div className="bg-blue-900 basis-9/10 p-4">
                        Content
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home