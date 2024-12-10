import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/features/categoriesSlice";
import Select from "react-select";
import { createTopic, deleteTopic, fetchPosts } from "../redux/features/postsSlice";
import HomePost from "./PostDetail";

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
                                        <HomePost
                                            key={post.id}
                                            post={post}
                                            index={index}
                                            handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                        />
                                    ))}
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
                <Sidebar />
            </div>

        </>

    );
};

export default Home;
