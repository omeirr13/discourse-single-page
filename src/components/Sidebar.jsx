import { sidebar_items } from "../constants";

const Sidebar = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 max-w-xs w-full h-screen" dir="rtl" style={{ height: "calc(100vh - 73px)", width:"230px" }} >
            <ul className="space-y-4 text-gray-600 text-right mr-5 mt-4">
                {sidebar_items.items.map((item, index) => (
                    <li key={index} className="hover:text-teal-700">{item}</li>
                ))}
            </ul>
            <h3 className="font-semibold text-xl text-gray-800 text-right mb-4 mt-4">القائمة</h3>
            <ul className="space-y-4 text-gray-600 text-right">
                {sidebar_items.majtama_items.map((item, index) => (
                    <li key={index} className="hover:text-teal-700 mr-5">{item}</li>
                ))}
            </ul>
            <h3 className="font-semibold text-xl text-gray-800 text-right mb-4 mt-4">القائمة</h3>
            <ul className="space-y-4 text-gray-600 text-right">
                {sidebar_items.rawabat_items.map((item, index) => (
                    <li key={index} className="hover:text-teal-700 mr-5">{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;