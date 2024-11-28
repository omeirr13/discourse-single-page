import { useState } from "react";
import Post from "./Post";
import Sidebar from "./Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ForumPage = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            username: "أسم المستخدم",
            time: "3 أيام",
            content: "السلام عليكم، أرغب في معرفة طرق تحسين أداء الموقع لدي.",
            replies: 4,
        },
        {
            id: 2,
            username: "أسم المستخدم",
            time: "1 أسبوع",
            content: "هل يوجد إمكانية لإضافة خاصية لتحميل الملفات بشكل أسرع؟",
            replies: 2,
        },
    ]);

    const [formVisible, setFormVisible] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        category: "",
        subject: "",
        content: "",
        selectedOption: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setPosts([
            ...posts,
            {
                ...newPost,
                id: posts.length + 1,
                username: "أسم المستخدم",
                time: "الآن",
                replies: 0,
            },
        ]);
        setNewPost({ title: "", category: "", subject: "", content: "", selectedOption: "" });
        setFormVisible(false);
    };

    const handleClose = () => {
        setNewPost({ title: "", category: "", subject: "", content: "", selectedOption: "" });
        setFormVisible(false);
    };

    const handleDelete = (postId) => {
        setPosts(posts.filter((post) => post.id !== postId));
    };

    return (
        <div className="flex space-x-8 justify-center">
            {formVisible && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-20">
                    <div className="w-1/2 p-l6 pr-6 mt-1 bg-[#fbfdfe] shadow-lg border-t-[10px] border-t-[#004D5A]" dir="rtl">
                        <div className="rounded-lg p-4 mb-6">
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="title"
                                        className="block text-right font-semibold text-gray-800"
                                    >
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
                                    <div className="flex space-x-4 gap-3 items-center bg-white w-[43vw] h-[54px] p-2 border border-gray-300 rounded-lg">
                                        <label>
                                            <input
                                                type="radio"
                                                name="selectedOption"
                                                value="option1"
                                                checked={newPost.selectedOption === "option1"}
                                                onChange={handleInputChange}
                                                className="ml-2"
                                            />
                                            الاقسام
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="selectedOption"
                                                value="option2"
                                                checked={newPost.selectedOption === "option2"}
                                                onChange={handleInputChange}
                                                className="ml-2"
                                            />
                                            الموضوع
                                        </label>
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <label
                                        htmlFor="content"
                                        className="block text-right font-semibold text-gray-800"
                                    >
                                        اكتب موضوعك هنا:
                                    </label>
                                    <ReactQuill
                                        value={newPost.content}
                                        onChange={(content) => setNewPost({ ...newPost, content })}
                                        className="p-2 rounded-lg ml-2"
                                        theme="snow"
                                        dir="rtl"
                                    />
                                </div>
                                <div className="flex space-x-4 mt-4">
                                    <button
                                        type="submit"
                                        className="btn bg-blue-500 px-4 py-2 rounded ml-3 text-white"
                                    >
                                        نشر
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-4 py-2 rounded bg-gray-200 text-black"
                                    >
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
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
            <Sidebar />
        </div>
    );
};

export default ForumPage;
