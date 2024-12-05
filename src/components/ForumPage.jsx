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

const ForumPage = () => {
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

    if (categoriesStatus === "loading" || postsStatus == "loading") {
        return <p>Loading...</p>;
    }

    const DefaultPostSearch = () => {
        return (
            <div>
                <div className="mr-[4rem]">

                    <div className="flex gap-3">
                        <img src="/images/sidebar/pattiyan.png" className="w-[48px] h-[48px]" />
                        <p className="font-bold w-auto h-auto text-3xl">محتاج فزعتكم</p>
                    </div>
                    <p className="text-[#707070] mt-2">انشئ مجتمع سلة ليكون المكان الأمثل والأكثر موثوقية للتجارة، لتبادل الافكار  والخبرات</p>
                </div>
                <input
                    type="text"
                    className="mr-4 mt-5 border-[#BBBBBB] border-[1px] border-solid rounded-[8px] h-[45px] w-[50vw] pr-[3vw] pl-4"
                    placeholder="ابحث عن سؤالك هنا ..."
                    style={{
                        backgroundImage: "url('/images/sidebar/search.png')",
                        backgroundSize: '20px 20px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '47.5vw center',
                    }}
                />

            </div>
        )
    }

    return (
        <>
            <Header />
            <div className="flex justify-end">
                <div className="flex space-x-8 justify-end w-full">
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
                    <div className="p-6 mt-4 w-full" dir="rtl">
                        <DefaultPostSearch />
                        <div className="flex">
                            <div className="posts-container w-[47vw] mt-[3rem]" style={{ display: 'inline-block', verticalAlign: 'top' }}>
                                {posts.map((post, index) => (
                                    <Post
                                        key={post.id}
                                        post={post}
                                        index={index}
                                        handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                    />
                                ))}
                            </div>

                                <LeftSidebar />
                        </div>


                    </div>
                </div>
                <Sidebar />
            </div>

        </>

    );
};

export default ForumPage;
