import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import HomePost from "./HomePost";
import Sidebar from "../Sidebar";
import { deleteTopic, fetchPosts, fetchCategoryPosts } from "../../redux/features/postsSlice";
import { fetchCategories } from "../../redux/features/categoriesSlice";
const Home = () => {
    const [searchQuery, setSearchQuery] = useState(""); // Search query state
    const [newPost, setNewPost] = useState({
        title: "",
        category: "",
        raw: "",
    });

    const dispatch = useDispatch();
    const { posts, status: postsStatus, error: postsError } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPosts = posts.filter(
        (post) => post
            // post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const modalRef = useRef(null);

    const [sortSelected, setSortSelected] = useState("new");
    const handleChangeSortSelected = (sort) => {
        setSortSelected(sort);
        if(filterSelected){
            dispatch(fetchCategoryPosts(filterSelected,sort));
        }
        else {
            dispatch(fetchPosts(sort));
        }
    }

    const [filterSelected, setFilterSelected] = useState("");

    const handleFilterSelect = (category) => {
        setFilterSelected(category);
        if(category){
            dispatch(fetchCategoryPosts(category,sortSelected))
        }
        else {
            dispatch(fetchPosts(sortSelected));
        }
    };

    // const DefaultPostSearch = () => {
    //     return (
    //         <div>
    //             <div>
    //                 <div className="flex gap-3 items-center">
    //                     <img src="/images/sidebar/arrow-right.svg" />
    //                     <img src="/images/sidebar/bandages.png" className="w-4 h-4" />
    //                     <p className="font-bold w-auto h-auto text-[14px] text-[#444444]">محتاج فزعتكم</p>

    //                 </div>
    //                 {/* <p className="text-[#707070] mt-2">انشئ مجتمع سلة ليكون المكان الأمثل والأكثر موثوقية للتجارة، لتبادل الافكار  والخبرات</p> */}
    //             </div>
    //             {/* <input
    //                 type="text"
    //                 className="mr-4 mt-5 border-[#BBBBBB] border-[1px] border-solid rounded-[8px] h-[45px] w-[50vw] pr-[3vw] pl-4"
    //                 placeholder="ابحث عن سؤالك هنا ..."
    //                 style={{
    //                     backgroundImage: "url('/images/sidebar/search.png')",
    //                     backgroundSize: '20px 20px',
    //                     backgroundRepeat: 'no-repeat',
    //                     backgroundPosition: '47.5vw center',
    //                 }}
    //             /> */}

    //         </div>
    //     )
    // }

    const HomeSuggestedPost = () => {
        return (
            <div className="flex flex-col items-center mt-[18px]">
                <div className="flex gap-3 items-start justify-end mb-4">
                    <p className="text-[#333333] mt-[10px] font-semibold">
                        don’t miss it👋
                    </p>
                    <div className="w-[94px] h-[1px] mx-4 bg-[#E6E6E6] mt-[24px]"></div>
                    <div className="bg-white rounded-full border-[1px] border-[#EEEEEE]">
                        <img src={`/images/arrow-left.svg`} className="cursor-pointer rotate-180 p-4" />
                    </div>
                    <div className="bg-white rounded-full border-[1px] border-[#EEEEEE]">
                        <img src={`/images/arrow-left.svg`} className="cursor-pointer p-4" />
                    </div>
                </div>
                <div className="bg-white rounded-lg m-8 mt-1 px-3 py-2" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <div className="flex flex-col gap-3">
                        <div className="mt-2">
                            <span className="bg-[#83ECFF]  text-[#207A8A] p-1 rounded-lg">التسويق الالكتروني</span>
                        </div>
                        <img src="/images/home/suggested1.png" />
                        <p className="text-[#333333] text-[18px]">ورشة عمل: كيفية تحقيق التوازن بين المبيعات والتسويق</p>
                        <p className="text-[#333333] text-[14px] font-medium">أحمد مصطفى مدرب التنمية البشرية </p>
                        <div className="flex">
                            <img src="/images/home/calendar.svg" className="ml-1" />
                            <div className="flex text-[12px] text-[#666666]">

                                <p className="ml-1">الخميس</p>
                                <p className="ml-1">5 يونيو 2025</p>
                                <p>9:30 ص</p>
                            </div>
                        </div>
                        <button className="flex justify-center items-center border-[1px] border-[#76E8CD] p-3 m-2 rounded-md">
                            <span className="text-[#004D5A] font-bold">open now</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    const HomeSuggestedTopic = () => {
        return (
            <div className="flex flex-col items-center mt-[18px]">
                <div className="flex gap-3 items-start justify-end mb-4">
                    <p className="text-[#333333] mt-[10px] font-semibold">
                        don’t miss it👋
                    </p>
                    <div className="w-[94px] h-[1px] mx-4 bg-[#E6E6E6] mt-[24px]"></div>
                    <div className="bg-white rounded-full border-[1px] border-[#EEEEEE]">
                        <img src={`/images/arrow-left.svg`} className="cursor-pointer rotate-180 p-4" />
                    </div>
                    <div className="bg-white rounded-full border-[1px] border-[#EEEEEE]">
                        <img src={`/images/arrow-left.svg`} className="cursor-pointer p-4" />
                    </div>
                </div>
                <div className="bg-white rounded-lg m-8 mt-1 px-3 py-2" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <div className="flex flex-col">
                        <img src="/images/home/suggested2.png" />
                        <p className="text-[#666666] text-[16px] font-bold mt-2">تحسين تجربة المستخدم</p>
                        <p className="text-[#333333] text-[14px] font-normal line-clamp-2">
                            تحسين تجربة المستخدم في متجرك الإلكتروني أحد العناوين الأساسية في مهمتك لجذب المزيد من العملاء، وتعزيز ولائهم للمتجر، وإليك عدّة نصائح تساعدك في مهمّة
                        </p>

                        <div className="flex mt-4 justify-between">
                            <div className="mt-2 flex gap-2 items-center bg-[#FFF7DF] rounded-md px-2 max-h-fit">
                                <img src="/images/home/star.png" className="w-[16px] h-[16px]" />
                                <span className="text-[#A46F29] text-[14px] font-medium p-1 rounded-lg">مواضيع مميزة</span>
                            </div>
                            <div className="p-3 flex gap-8">
                                <div className="flex gap-2 items-center">
                                    <img src="/images/home/like.svg" className="cursor-pointer" />
                                    <span className="mb-1 text-[#999999]">14</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/images/home/cloud.svg" className="cursor-pointer" />
                                    <span className="mb-1 text-[#999999]">12</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const { categories, status: categoriesStatus, error: categoriesError } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories(true));
    }, [dispatch]);

    if (categoriesStatus =="loading" || postsStatus == "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src="/images/loader.gif" alt="Loading..." className="w-16 h-16" />
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end">
                <div className="flex justify-end w-full">
                    <div className="sm:p-6 mt-4 w-full" dir="rtl">
                        <div
                            className="flex flex-col items-center justify-center pb-[90px]"
                        >
                            <span
                                className="text-[#004D5A] sm:text-[64px] text-[48px] font-extrabold text-center"
                                style={{
                                    WebkitTextStroke: "3px #FFFFFF",
                                    WebkitTextFillColor: "#004D5A",
                                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                }}
                            >
                                جماعة سلا
                            </span>

                            <p className="mt-4 text-center hidden sm:block text-[#707070]">
                                Salla community tag line and description
                            </p>

                            <input
                                type="text"
                                className="mt-5 hidden sm:block border-[#BBBBBB] border-[1px] border-solid rounded-[8px] h-[45px] w-[37vw] pr-[3vw] pl-4 home-search"
                                placeholder="ابحث عن سؤالك"
                                onChange={handleSearchChange}
                                style={{
                                    backgroundImage: "url('/images/sidebar/search.png')",
                                    backgroundSize: "20px 20px",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "34.5vw center",
                                }}
                            />

                        </div>

                        <div className="flex justify-center">


                            {/* right part */}
                            <div className="sm:w-2/3 mt-4">
                                <div className="hidden sm:flex justify-between m-3">
                                    <div className="flex gap-5">
                                        <span className={sortSelected === "new" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2 cursor-pointer` : `text-[#666666] cursor-pointer`} onClick={() => handleChangeSortSelected("new")}>جديد</span>
                                        <span className={sortSelected === "latest" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2 cursor-pointer` : `text-[#666666] cursor-pointer`} onClick={() => handleChangeSortSelected("latest")}>الأكثر مشاهدة</span>
                                    </div>
                                    <div className=" mt-2 border  rounded-lg shadow-lg w-56 bg-white">
                                        <div className="flex flex-col p-2">
                                            <select
                                                className="w-full text-left px-2 py-2 rounded-md border"
                                                onChange={(e) => handleFilterSelect(e.target.value)}
                                                value={filterSelected}>
                                                <option value="">حدد عامل التصفية</option>
                                                {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
 
                                </div>
                                
                                <div className="mt-2">
                                    {filteredPosts.length === 0 ? (
                                        <div>أُووبس! لا توجد مشاركات جديدة</div>
                                    ) : (
                                        filteredPosts.map((post, index) => (
                                            <HomePost
                                                key={post.id}
                                                post={post}
                                                index={index}
                                                handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* left part */}
                            <div className="w-1/3 sm:flex hidden flex-col gap-4">
                                <HomeSuggestedPost />
                                <HomeSuggestedTopic />
                                <HomeSuggestedTopic />
                            </div>

                        </div>
                    </div>
                    <div className="flex">


                    </div>
                </div>
                <Sidebar categories={categories}/>
            </div>

        </>

    );
};

export default Home;
