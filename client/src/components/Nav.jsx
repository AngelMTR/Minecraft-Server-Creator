import { h } from 'preact';
import { Link } from "preact-router";

// بارگذاری دینامیک فایل‌ها از پوشه 'modules'
const modules = import.meta.glob('/src/modules/*.jsx'); // تمام فایل‌های جاوااسکریپت در فولدر modules رو پیدا می‌کنه
// استخراج اسم فایل‌ها از مسیرها
const customOrder = ["Server", "Properties", "Console", "Log", "Players", "Software", "Files", "Worlds", "Backups", "Access"]; // ترتیب دلخواه
const moduleNames = Object.keys(modules).map((modulePath) => {
    const fileName = modulePath.split('/').pop().replace('.jsx', '');
    return fileName.charAt(0).toUpperCase() + fileName.slice(1);
});
const orderedModules = customOrder.filter((item) => moduleNames.includes(item));

const Nav = () => {
    return (
        <>
            <aside className="w-1/10 bg-gray-800 p-4">
                <nav>
                    <ul>
                        {orderedModules.map((item, index) => (
                            <li key={index} className="cursor-pointer flex flex-col hover:bg-gray-700">
                                <Link className="" href={`/${item.toLowerCase()}`}>
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Nav;
