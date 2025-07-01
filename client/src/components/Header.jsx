import {h} from 'preact';

const Header = () => {
    return (
        <header className="flex bg-gray-900 shadow-md py-4">
            <div className="px-4 w-full flex justify-between">
                <div> Minecraft Server Creator</div>
                <div> Account</div>
            </div>
        </header>
    )
}

export default Header