import { useState } from "react";
import { sidebar_items } from "../constants";

const Item = ({ name, image }) => {
    return (
        <div className="flex gap-2">
            <img src={`/images/sidebar/${image}`} />
            <li className="inline text-[16px] hover:text-teal-700 text-base w-full">{name}</li>
        </div>
    );
};

const Sidebar = () => {
    const [isJadeedOpen, setIsJadeedOpen] = useState(false);
    const [isMajtamaOpen, setIsMajtamaOpen] = useState(false);
    const [isRawabatOpen, setIsRawabatOpen] = useState(false);

    const toggleJadeed = () => setIsJadeedOpen(!isJadeedOpen);
    const toggleMajtama = () => setIsMajtamaOpen(!isMajtamaOpen);
    const toggleRawabat = () => setIsRawabatOpen(!isRawabatOpen);

    return (
        <div className="rounded-lg p-4 max-w-xs w-full h-screen mt-[2rem] hidden sm:block" dir="rtl" style={{ height: "calc(100vh - 73px)", width: "230px" }}>
            <ul className="space-y-4 text-gray-600 text-right mr-5 mt-4 w-full">
                {sidebar_items.items.map((item, index) => (
                    <Item key={index} name={item.name} image={item.image} />
                ))}
            </ul>

            <div className="flex justify-between items-center w-48" onClick={toggleJadeed}>
                <h3 className="font-semibold text-[16px] text-gray-800 text-right mb-4 mt-4 mr-4">*جديد سلة (فكرة)</h3>
                <img src={`/images/sidebar/arrow-down.png`} className={`w-6 h-6 ml-[-5px] cursor-pointer ${isJadeedOpen ? 'rotate-180' : ''}`} />
            </div>
            {isJadeedOpen && (
                <ul className="space-y-4 text-gray-600 text-right mr-5">
                    {sidebar_items.jadeed.map((item, index) => (
                        <Item key={index} name={item.name} image={item.image} />
                    ))}
                </ul>
            )}

            <div className="flex justify-between items-center" onClick={toggleMajtama}>
                <h3 className="font-semibold text-[16px] text-gray-800 text-right mb-4 mt-4 mr-4">المجتمع</h3>
                <img src={`/images/sidebar/arrow-down.png`} className={`w-6 h-6 cursor-pointer ${isMajtamaOpen ? 'rotate-180' : ''}`} />
            </div>
            {isMajtamaOpen && (
                <ul className="space-y-4 text-gray-600 text-right mr-5">
                    {sidebar_items.majtama_items.map((item, index) => (
                        <Item key={index} name={item.name} image={item.image} />
                    ))}
                </ul>
            )}

            <div className="flex justify-between items-center" onClick={toggleRawabat}>
                <h3 className="font-semibold text-[16px] text-gray-800 text-right mb-4 mt-4 mr-4">روابط مهمة</h3>
                <img src={`/images/sidebar/arrow-down.png`} className={`w-6 h-6 cursor-pointer ${isRawabatOpen ? 'rotate-180' : ''}`} />
            </div>
            {isRawabatOpen && (
                <ul className="space-y-4 text-gray-600 text-right mr-5">
                    {sidebar_items.rawabat_items.map((item, index) => (
                        <Item key={index} name={item.name} image={item.image} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
