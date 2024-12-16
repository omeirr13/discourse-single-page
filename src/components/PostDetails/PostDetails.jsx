import { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/features/categoriesSlice";
import Select from "react-select";
import { appendPost, createTopic, deleteTopic, fetchPosts } from "../../redux/features/postsSlice";
import Header from "../Header";
import PostDetail from "./PostDetail";
import { useParams } from "react-router-dom";
import HomePost from "../Home/HomePost";
import PostDetailItem from "./PostDetailItem";
import { appendPostOfTopic, fetchTopicData } from "../../redux/features/topicsSlice";
import axios from "axios";

const PostDetails = () => {
    const { topicId } = useParams();

    const [formVisible, setFormVisible] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const { categories, status: categoriesStatus } = useSelector((state) => state.categories);


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTopicData(topicId));
    }, [dispatch]);
    const { topicPosts, topicDetails, status: postsStatus, error } = useSelector((state) => state.topics);

    const handleClose = () => {
        setReplyContent("");
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


    const post = topicDetails.mainPost || {};
    const postRefs = useRef({});

    const handleJumpToPost = (postId) => {
        if (postRefs.current[postId]) {
            postRefs.current[postId].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const { id, category_id } = topicDetails;
        formData.append("raw", quillRef.current.getEditor().getText());
        formData.append("category", category_id);
        formData.append("topic_id", id);
        formData.append("nested_post", "true");

        try {
            const userObj = localStorage.getItem("salla_discourse_user");
            const user = JSON.parse(userObj);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts`, formData, {
                headers: {
                    'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                    'Api-Username': user.username,
                    'Content-Type': 'application/json'
                }
            });
            const { data } = response;
            if (data.success) {
                setReplyContent("");
                setFormVisible(false);
                dispatch(appendPostOfTopic(response?.data?.post));
            } else {
                console.error("Failed to post:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const quillRef = useRef(null);
    if (postsStatus == "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src="/images/loader.gif" alt="Loading..." className="w-16 h-16" />
            </div>
        );
    }
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
                                            <label htmlFor="content" className="block text-right font-semibold text-gray-800">
                                                اكتب ردك هنا:
                                            </label>
                                            <ReactQuill
                                                ref={quillRef}
                                                // value={replyContent}
                                                // onChange={(raw) => setReplyContent(raw)}
                                                className="p-2 rounded-lg"
                                                theme="snow"
                                                dir="rtl"
                                            />
                                        </div>

                                        <div className="flex space-x-4 mt-4">
                                            <button type="submit" className="btn bg-blue-500 px-4 py-2 rounded ml-3 text-white">
                                                {
                                                    postsStatus=="loading" ? "Loading" : "نشر" 
                                                }
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
                                    post={post}
                                    topicDetails={topicDetails}
                                    isTopic={true}
                                    // index={index}
                                    handleJumpToPost={handleJumpToPost}
                                />
                                <div className="my-5 flex justify-end">
                                    {/* <div className="flex gap-2 mr-3">
                                        4 فزعات
                                    </div> */}
                                    <div className="py-2 px-6 border-[1px] border-[#DDDDDD] rounded-lg text-[#666666]">
                                        رتب حسب<b> الأحدث</b>
                                    </div>
                                </div>
                                {topicPosts.map((post) => {
                                    return (
                                        <div key={post.id} ref={(el) => (postRefs.current[post.id] = el)}>
                                            <PostDetail
                                                post={post}
                                                topicDetails={topicDetails}
                                                isTopic={false}
                                                handleJumpToPost={handleJumpToPost}

                                            // index={index}
                                            />
                                        </div>
                                    )
                                })}
                                {/* <PostDetail
                                    key={post.id}
                                    post={post}
                                    isTopic={false}
                                    // index={index}
                                    handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                /> */}
                                {/* ))} */}
                            </div>
                        </div>
                        <div className="flex gap-4 mt-[2rem]">
                            <div className="bg-[#004D5A] cursor-pointer flex gap-2 flex-grow-0 px-9 py-3 rounded-md" onClick={() => setFormVisible(true)}>
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