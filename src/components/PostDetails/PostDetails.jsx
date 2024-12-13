import { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/features/categoriesSlice";
import Select from "react-select";
import { createTopic, deleteTopic, fetchPosts } from "../../redux/features/postsSlice";
import Header from "../Header";
import PostDetail from "./PostDetail";
import { useParams } from "react-router-dom";
import HomePost from "../Home/HomePost";
import PostDetailItem from "./PostDetailItem";

const PostDetails = () => {
    const { postId } = useParams();
    console.log(postId);

    const [formVisible, setFormVisible] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        category: "",
        raw: "",
    });
    const { categories, status: categoriesStatus } = useSelector((state) => state.categories);


    const dispatch = useDispatch();
    const { posts, status: postsStatus, error: postsError } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchPosts("latest"));
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

    if (postsStatus == "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src="/images/loader.gif" alt="Loading..." className="w-16 h-16" />
            </div>
        );
    }

    const topic = posts[8];
    const post = posts[0];

    const replies = [
        {
            replied_to: "وسيم يوسف",
            replied_to_content: "السلام عليكم ورحمة الله وبركاته يعطيكم العافيه حابه استفسر في احد فاتح المتجر بوثيقة العمل الحر و ينزل له حساب المواطن؟او وثيقة العمل الحر توقفه؟",
            reply: "السلام عليكم ورحمة الله وبركاته يعطيكم العافيه حابه استفسر في احد فاتح المتجر بوثيقة العمل الحر و ينزل له حساب المواطن؟او وثيقة العمل الحر توقفه؟",
        },
        {
            replied_to: "وسيم يوسف",
            replied_to_content: "السلام عليكم ورحمة الله وبركاته يعطيكم العافيه حابه استفسر في احد فاتح المتجر بوثيقة العمل الحر و ينزل له حساب المواطن؟او وثيقة العمل الحر توقفه؟",
            reply: "السلام عليكم ورحمة الله وبركاته يعطيكم العافيه حابه استفسر في احد فاتح المتجر بوثيقة العمل الحر و ينزل له حساب المواطن؟او وثيقة العمل الحر توقفه؟",
        }
    ]
    return (
        <>
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
                                                options={[]}
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
                        <div className="flex">
                            <div className="posts-container mt-[3rem]  w-full" style={{ display: 'inline-block', verticalAlign: 'top' }}>
                                {/* {posts.map((post, index) => ( */}
                                <PostDetail
                                    key={post.id}
                                    post={topic}
                                    isTopic={true}
                                    // index={index}
                                    handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                />
                                <div className="my-5 flex justify-between">
                                    <div className="flex gap-2 mr-3">
                                        4 فزعات
                                    </div>
                                    <div className="py-2 px-6 border-[1px] border-[#DDDDDD] rounded-lg text-[#666666]">
                                        رتب حسب<b> الأحدث</b>
                                    </div>
                                </div>
                                <PostDetail
                                    key={post.id}
                                    post={post}
                                    isTopic={false}
                                    // index={index}
                                    replies={replies}
                                    handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                />
                                <PostDetail
                                    key={post.id}
                                    post={post}
                                    isTopic={false}
                                    // index={index}
                                    handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                />
                                {/* ))} */}
                            </div>
                        </div>
                        <div className="flex gap-4 mt-[2rem]">
                            <div className="bg-[#004D5A] cursor-pointer flex gap-2 flex-grow-0 px-9 py-3 rounded-md">
                                <img src="/images/post/link-forward.svg" className="w-[17px]" />
                                <span className="text-white">رد</span>
                            </div>
                            <div className="border-[1px] cursor-pointer border-[#96EDD9] px-9 py-3 flex flex-grow-0 rounded-md">
                                <img src="/images/post/paper-clip.svg" />
                                <span className="text-[#004D5A] font-medium">شارك</span>
                            </div>
                        </div>


                        {/* last section */}
                        <div className="mt-[6rem]">
                            <span className="text-[18px] text-[#333333] font-medium">مواضيع مشابهة</span>
                            <div className="mt-[2rem]">
                                <PostDetailItem post={post} />
                                <PostDetailItem post={post} />
                            </div>
                        </div>



                    </div>
                </div>
                <Sidebar categories={categories} categoryId={-1} />
            </div>

        </>

    );
};

export default PostDetails;