import { useState } from "react";
import { sidebar_items } from "../constants";
import { Link } from "react-router-dom";
import React from "react";

const Item = ({ name, linkhref }) => {
    return (
        <div className="flex gap-2">
            <Link to={linkhref}>
                <li className="inline text-[16px] hover:text-teal-700 text-base w-full cursor-pointer">{name}</li>
            </Link>
        </div>
    );
};

const RbatItem = ({ name, image, linkhref }) => {
    return (
        <div className="flex gap-2">
            <img src={image} alt="" />
            <Link to={linkhref}>
                <li className="inline text-[16px] hover:text-teal-700 text-base w-full cursor-pointer">{name}</li>
            </Link>
        </div>
    );
};


const Sidebar = ({ categories }) => {

    const [closedIds, setClosedIds] = useState([]);
    const [linksOpen, setLinksOpen] = useState(true);

    const toggleLinks = () => {
        setLinksOpen(prev => !prev);
    }
    // if (categoriesStatus === "loading") {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <img src="/images/loader.gif" alt="Loading..." className="w-16 h-16" />
    //         </div>
    //     );
    // }

    const toggle = (id) => {
        if (closedIds.includes(id)) {
            setClosedIds(closedIds.filter((closedId) => closedId !== id));
        }
        else {
            setClosedIds([...closedIds, id]);
        }
    }
    return (
        <div className="rounded-lg p-4 max-w-xs w-full h-screen mt-[2rem] hidden sm:block " dir="rtl" style={{ height: "calc(100vh - 73px)", width: "230px" }}>
            {categories.forEach((category) => {
                if (!category.subcategory_list) {
                    if (!category.has_children) {
                        return (
                            <ul className="space-y-4 text-gray-600 text-right mr-5" key={category.id}>
                                <Item name={category.name} key={category.id} id={category.id} linkhref={`/category-detail/${category.id}`} />
                            </ul>
                        )
                    }
                }
                else {
                    return (
                        <React.Fragment key={category.id}>
                            <div className="flex justify-between items-center w-48 mt-3" onClick={() => toggle(category.id)} >
                                <h3 className="font-semibold text-[16px] text-gray-800 text-right mb-4 mt-4 mr-4 cursor-pointer">{category.name}</h3>
                                <img src={`/images/sidebar/arrow-down.png`} alt="" className={`w-6 h-6 ml-[-5px] cursor-pointer ${!closedIds.includes(category.id) ? 'rotate-180' : ''}`} />
                            </div>
                            {!closedIds.includes(category.id) && (
                                <ul className="space-y-4 text-gray-600 text-right mr-5">
                                    {category.subcategory_list.map((subcategory) => (
                                        <Item key={subcategory.id} name={subcategory.name} id={subcategory.id} linkhref={`/category-detail/${subcategory.id}`} />
                                    ))}
                                </ul>
                            )}
                        </React.Fragment>
                    )

                }
            })}
            <div className="flex justify-between items-center mt-3" onClick={toggleLinks}>
                <h3 className="font-semibold text-[16px] text-gray-800 text-right mb-4 mt-4 mr-4">روابط مهمة</h3>
                <img src={`/images/sidebar/arrow-down.png`} alt="" className={`w-6 h-6 cursor-pointer ${linksOpen ? 'rotate-180' : ''}`} />
            </div>
            {linksOpen && (
                <ul className="space-y-4 text-gray-600 text-right mr-5">
                    {sidebar_items.rawabat_items.map((item) => (
                        <RbatItem key={item.id} name={item.name} image={item.image} linkhref={item.link} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
