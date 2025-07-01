import { h } from 'preact';
import { Router } from 'preact-router';
import NotFound from "@/components/NotFound.jsx";

// بارگذاری داینامیک ماژول‌ها به صورت همزمان (eager)
const modules = import.meta.glob('/src/modules/*.jsx', { eager: true });

// استخراج اطلاعات مسیر و کامپوننت از فایل‌های موجود
const moduleRoutes = Object.keys(modules).map((modulePath) => {
    // استخراج اسم فایل (بدون پسوند .jsx)
    const fileName = modulePath.split('/').pop().replace('.jsx', '');
    // تعیین مسیر: مثلاً "Console" به "/console"
    const routePath = `/${fileName.toLowerCase()}`;
    // گرفتن کامپوننت (فرض بر این است که کامپوننت به صورت default export شده)
    const Component = modules[modulePath].default;
    return { routePath, Component };
});

const Contant = () => {
    return (
        <main className="flex-1 bg-gray-700 p-6 m-6 rounded-2xl shadow-2xl">
            <Router>
                {moduleRoutes.map(({ routePath, Component }, index) => (
                    // رندر هر کامپوننت به همراه مسیرش
                    <Component path={routePath} key={index} />
                ))}
                <NotFound default />
            </Router>
        </main>
    );
};

export default Contant;
