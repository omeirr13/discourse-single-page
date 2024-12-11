import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/features/categoriesSlice";
import { sidebar_items } from "../constants";

const Item = ({ name }) => {
    return (
        <div className="flex gap-2">
            <a href="#" target="_blank">
                <li className="inline text-[16px] hover:text-teal-700 text-base w-full cursor-pointer">{name}</li>
            </a>
        </div>
    );
};


const Sidebar = () => {
    const dispatch = useDispatch();
    const { categories, status: categoriesStatus, error: categoriesError } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories(true));
    }, [dispatch]);

    const [closedIds, setClosedIds] = useState([]);
    const [linksOpen, setLinksOpen] = useState(true);

    const toggleLinks = () => {
        setLinksOpen(prev => !prev);
    }
    if (categoriesStatus === "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src="/images/loader.gif" alt="Loading..." className="w-16 h-16" />
            </div>
        );
    }

    const toggle = (id) => {
        if (closedIds.includes(id)) {
            setClosedIds(closedIds.filter((closedId) => closedId !== id));
        }
        else {
            setClosedIds([...closedIds, id]);
        }
    }
    return (
        <div className="rounded-lg p-4 max-w-xs w-full h-screen mt-[2rem] hidden sm:block" dir="rtl" style={{ height: "calc(100vh - 73px)", width: "230px" }}>
            {categories.map((category) => {
                if (!category.subcategory_list) {
                    if (!category.has_children) {
                        return (
                            <Item name={category.name} />
                        )
                    }
                }
                else {
                    return (
                        <>
                            <div className="flex justify-between items-center w-48" onClick={() => toggle(category.id)} >
                                <h3 className="font-semibold text-[16px] text-gray-800 text-right mb-4 mt-4 mr-4 cursor-pointer">{category.name}</h3>
                                <img src={`/images/sidebar/arrow-down.png`} className={`w-6 h-6 ml-[-5px] cursor-pointer ${!closedIds.includes(category.id) ? 'rotate-180' : ''}`} />
                            </div>
                            {!closedIds.includes(category.id) && (
                                <ul className="space-y-4 text-gray-600 text-right mr-5">
                                    {category.subcategory_list.map((subcategory) => (
                                        <Item name={subcategory.name} />
                                    ))}
                                </ul>
                            )}
                        </>
                    )

                }
            })}
            <div className="flex justify-between items-center" onClick={toggleLinks}>
                <h3 className="font-semibold text-[16px] text-gray-800 text-right mb-4 mt-4 mr-4">روابط مهمة</h3>
                <img src={`/images/sidebar/arrow-down.png`} className={`w-6 h-6 cursor-pointer ${linksOpen ? 'rotate-180' : ''}`} />
            </div>
            {linksOpen && (
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
