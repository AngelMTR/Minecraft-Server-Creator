import { h } from 'preact';
import { Link } from "preact-router";

// بارگذاری دینامیک فایل‌ها از پوشه 'modules'
const modules = import.meta.glob('/src/modules/*.jsx'); // تمام فایل‌های جاوااسکریپت در فولدر modules رو پیدا می‌کنه

// استخراج اسم فایل‌ها از مسیرها
const moduleNames = Object.keys(modules).map((modulePath) => {
    const fileName = modulePath.split('/').pop().replace('.jsx', ''); // اسم فایل رو از مسیر جدا می‌کنیم
    return fileName.charAt(0).toUpperCase() + fileName.slice(1); // اولین حرف رو بزرگ می‌کنیم
});

const Nav = () => {
    return (
        <>
            <aside className="w-1/10 bg-gray-800 p-4">
                <nav>
                    <ul>
                        {moduleNames.map((item, index) => (
                            <li key={index} className="mb-2">
                                {/* استفاده از 'to' به جای 'href' */}
                                <Link className="text-blue-500 hover:underline" to={`/${item.toLowerCase()}`}>
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
