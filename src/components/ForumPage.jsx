import { useEffect, useState } from "react";
import Post from "./Post";
import Sidebar from "./Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/features/categoriesSlice";
import Select from "react-select";
import { createPost, deletePost } from "../redux/features/postsSlice";

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
        dispatch(createPost(newPost));
        setNewPost({ title: "", category: "", raw: "" });
        setFormVisible(false);
    };

    const handleClose = () => {
        setNewPost({ title: "", category: "",raw: "" });
        setFormVisible(false);
    };

    if (categoriesStatus === "loading" || postsStatus == "loading") {
        return <p>Loading...</p>;
    }
    return (
        <div className="flex space-x-8 justify-center">
            {formVisible && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-20">
                    <div className="w-1/2 p-l6 pr-6 mt-1 bg-[#fbfdfe] shadow-lg border-t-[10px] border-t-[#004D5A]" dir="rtl">
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
            <div className="w-full p-6 mt-4" dir="rtl">
                <button
                    onClick={() => setFormVisible(true)}
                    className="btn bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mr-4"
                >
                    إضافة موضوع
                </button>
                <div className="rounded-lg p-4 mb-6 w-full">
                    {posts.map((post, index) => (
                        <Post
                            key={post.id}
                            post={post}
                            index={index}
                            handleDelete={() => { dispatch(deletePost(post.id)) }}
                        />
                    ))}
                </div>
            </div>
            <Sidebar />
        </div>
    );
};

export default ForumPage;
