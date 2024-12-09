import { useEffect, useRef, useState } from "react";
import Post from "./Post";
import Sidebar from "./Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/features/categoriesSlice";
import Select from "react-select";
import { createTopic, deleteTopic, fetchPosts } from "../redux/features/postsSlice";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import PostDetail from "./PostDetail";

const Home = () => {
    const [formVisible, setFormVisible] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        category: "",
        raw: "",
    });

    const dispatch = useDispatch();
    const { categories, status: categoriesStatus, error: categoriesError } = useSelector((state) => state.categories);
    const { posts, status: postsStatus, error: postsError } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleSelectChange = (selectedOption) => {
        setNewPost({ ...newPost, category: selectedOption });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // setPosts([
        //     ...posts,
        //     {
        //         ...newPost,
        //         id: posts.length + 1,
        //         username: "أسم المستخدم",
        //         time: "الآن",
        //         replies: 0,
        //     },
        // ]);
        dispatch(createTopic(newPost));
        setNewPost({ title: "", category: "", raw: "" });
        setFormVisible(false);
    };

    const handleClose = () => {
        setNewPost({ title: "", category: "", raw: "" });
        setFormVisible(false);
    };


    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClose]);
    const [filterSelected, setFilterSelected] = useState("new");
    const handleChangeFilterSelected = (filter) => {
        setFilterSelected(filter);
    }

    const [filterListOpen, setFilterListOpen] = useState(false);
    if (categoriesStatus === "loading" || postsStatus == "loading") {
        return <p>Loading...</p>;
    }

    const DefaultPostSearch = () => {
        return (
            <div>
                <div>
                    <div className="flex gap-3 items-center">
                        <img src="/images/sidebar/arrow-right.svg" />
                        <img src="/images/sidebar/bandages.png" className="w-4 h-4" />
                        <p className="font-bold w-auto h-auto text-[14px] text-[#444444]">محتاج فزعتكم</p>

                    </div>
                    {/* <p className="text-[#707070] mt-2">انشئ مجتمع سلة ليكون المكان الأمثل والأكثر موثوقية للتجارة، لتبادل الافكار  والخبرات</p> */}
                </div>
                {/* <input
                    type="text"
                    className="mr-4 mt-5 border-[#BBBBBB] border-[1px] border-solid rounded-[8px] h-[45px] w-[50vw] pr-[3vw] pl-4"
                    placeholder="ابحث عن سؤالك هنا ..."
                    style={{
                        backgroundImage: "url('/images/sidebar/search.png')",
                        backgroundSize: '20px 20px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '47.5vw center',
                    }}
                /> */}

            </div>
        )
    }

    return (
        <>
            <div className="flex justify-end">
                <div className="flex justify-end w-full">
                    {formVisible && (
                        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-20">
                            <div className="w-1/2 p-l6 pr-6 mt-1 bg-[#fbfdfe] shadow-lg border-t-[10px] border-t-[#004D5A]" dir="rtl" ref={modalRef}>
                                <div className="rounded-lg p-4 mb-6">
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="mb-4">
                                            <label htmlFor="title" className="block text-right font-semibold text-gray-800">
                                                اكتب العنوان
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={newPost.title}
                                                onChange={handleInputChange}
                                                className="w-[43vw] h-[54px] p-2 border border-gray-300 rounded-lg mt-2"
                                                placeholder="اكتب عنوان مختصر يقدم نبذه عن الموضوع"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="selectedOptions" className="block text-right font-semibold text-gray-800">
                                                اختر الأقسام أو الموضوع:
                                            </label>
                                            <Select
                                                // isMulti
                                                name="selectedOptions"
                                                options={categories}
                                                value={newPost.selectedOptions}
                                                onChange={handleSelectChange}
                                                className="mt-2 w-[43vw]"
                                                placeholder="اختر الأقسام أو الموضوع"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="content" className="block text-right font-semibold text-gray-800">
                                                اكتب موضوعك هنا:
                                            </label>
                                            <ReactQuill
                                                value={newPost.raw}
                                                onChange={(raw) => setNewPost({ ...newPost, raw })}
                                                className="p-2 rounded-lg"
                                                theme="snow"
                                                dir="rtl"
                                            />
                                        </div>

                                        <div className="flex space-x-4 mt-4">
                                            <button type="submit" className="btn bg-blue-500 px-4 py-2 rounded ml-3 text-white">
                                                نشر
                                            </button>
                                            <button type="button" onClick={handleClose} className="px-4 py-2 rounded bg-gray-200 text-black">
                                                إلغاء
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="sm:p-6 mt-4 w-full" dir="rtl">
                        <div
                            className="flex flex-col items-center justify-center"
                        >
                            <span
                                className="text-[#004D5A] sm:text-[64px] text-[48px] font-extrabold text-center"
                                style={{
                                    WebkitTextStroke: "3px #FFFFFF",
                                    WebkitTextFillColor: "#004D5A",
                                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                }}
                            >
                                Salla Community
                            </span>

                            <p className="mt-4 text-center hidden sm:block text-[#707070]">
                                Salla community tag line and description
                            </p>

                            <input
                                type="text"
                                className="mt-5 hidden sm:block border-[#BBBBBB] border-[1px] border-solid rounded-[8px] h-[45px] w-[37vw] pr-[3vw] pl-4 home-search"
                                placeholder="search for your question"
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
                                        <span className={filterSelected === "new" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2` : `text-[#666666]`} onClick={() => handleChangeFilterSelected("new")}>new</span>
                                        <span className={filterSelected === "most viewed" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2` : `text-[#666666]`} onClick={() => handleChangeFilterSelected("most viewed")}>most viewed</span>
                                    </div>
                                    <div>
                                        <div className="flex gap-12 border-[1px] border-[#DDDDDD] rounded-md px-3 py-2">
                                            <span className="text-[#666666]">Filters</span>
                                            <img src={`/images/header/arrow-down.svg`} className={`cursor-pointer ${filterListOpen ? 'rotate-180' : ''}`} onClick={() => setFilterListOpen(prev => !prev)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    {posts.map((post, index) => (
                                        <PostDetail
                                            key={post.id}
                                            post={post}
                                            index={index}
                                            handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* left part */}
                            <div className="w-1/3 mt-6 sm:flex gap-3 items-start justify-end ml-9 hidden">
                                <p className="text-[#333333] mt-[10px] font-semibold">
                                    don’t miss it 👋 
                                </p>
                                <div className="w-[94px] h-[1px] mx-4 bg-[#E6E6E6] mt-[24px]"></div>
                                <div className="bg-white rounded-full">
                                    <img src={`/images/arrow-left.svg`} className="cursor-pointer rotate-180 p-4" />
                                </div>
                                <div className="bg-white rounded-full">
                                    <img src={`/images/arrow-left.svg`} className="cursor-pointer p-4" />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="flex">


                    </div>
                </div>
                <Sidebar />
            </div>

        </>

    );
};

export default Home;
