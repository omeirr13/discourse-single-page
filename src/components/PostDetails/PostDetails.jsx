import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Sidebar from "../Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostItem from "../Home/PostItem";
import { appendPostOfTopic, fetchTopicData } from "../../redux/features/topicsSlice";
import axios from "axios";
import PostDetailItem from "./PostDetailItem";

const PostDetails = () => {
    const { topicId, postNumber } = useParams();

    const userObj = localStorage.getItem("salla_discourse_user");
    const user = JSON.parse(userObj);
    let isLoggedin = false;
    let isAdmin = false;
    if (user) {
        isLoggedin = true;
        if (user.admin) {
            isAdmin = true;
        }
    }

    const [formVisible, setFormVisible] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [showCopytooltip, setShowCopyTooltip] = useState(false);
    const [editorValue, setEditorValue] = useState("");

    // const { categories, status: categoriesStatus } = useSelector((state) => state.categories);


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTopicData(topicId,postNumber));
    }, [dispatch, topicId]);
    const { topicPosts, topicDetails, suggestedTopics, status: postsStatus, error } = useSelector((state) => state.topics);
    const handleClose = () => {
        setReplyContent("");
        setFormVisible(false);
    };

    const handleMainCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setShowCopyTooltip(true);

            // Hide the tooltip after 2 seconds
            setTimeout(() => setShowCopyTooltip(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };


    const modalRef = useRef(null);

    const imageHandler = (e) => {
        const editor = quillRef.current.getEditor();
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (/^image\//.test(file.type)) {
                const formData = new FormData();
                formData.append("type", "composer");
                formData.append("synchronous", true);
                formData.append("file", file);

                const uploadUrl = `${process.env.REACT_APP_API_URL}/uploads.json`;
                const userObj = localStorage.getItem("salla_discourse_user");
                const user = JSON.parse(userObj);

                try {
                    const response = await axios.post(uploadUrl, formData, {
                        headers: {
                            'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                            'Api-Username': user.username,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    const data = response.data;
                    const imageUrl = data.url;
                    editor.insertEmbed(editor.getSelection().index, "image", imageUrl.replace("//", "http://"));
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.error("Only image files are allowed.");
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', "strike"],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                ['image', "link"],
                [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#002966', '#3d1466'] }]
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), []);

    const handleChange = useCallback((value) => {
        setEditorValue(value);
    }, []);




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
    const postRefs = useRef([]);

    const handleJumpToPost = (post_number) => {
        const index = Number(post_number); // Ensure postId is a number
        if (postRefs.current[index]) {
            postRefs.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        } else {
            console.warn(`Post ref for ID ${post_number} not found.`);
        }
    };

    useEffect(() => {
        // Ensure topicPosts are loaded and postNumber is valid
        if (postsStatus === "succeeded" && postNumber) {
            const postIndex = Number(postNumber);
            if (postRefs.current[postIndex]) {
                postRefs.current[postIndex].scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }
    }, [postsStatus, postNumber]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if(!editorValue){
            console.log("you need to provide content first")
            return;
        }
        const formData = new FormData();
        const { id, category_id } = topicDetails;
        formData.append("raw", editorValue);
        formData.append("category", category_id);
        formData.append("topic_id", id);
        formData.append("nested_post", "true");

        if (replyToPostNumber) {
            formData.append("reply_to_post_number", replyToPostNumber);
        }
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
                setEditorValue("");
                setFormVisible(false);
                if (replyToPostNumber) {
                    dispatch(fetchTopicData(topicId,postNumber));
                } else {
                    dispatch(appendPostOfTopic(response?.data?.post));
                }
            } else {
                console.error("Failed to post:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        finally {
            setReplyToPostNumber(null);
        }
    };
    const quillRef = useRef(null);
    const [replyToPostNumber, setReplyToPostNumber] = useState(null);
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
                                                className="p-2 rounded-lg"
                                                theme="snow"
                                                modules={modules}
                                                value={editorValue}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="flex space-x-4 mt-4">
                                            <button type="submit" className="btn bg-blue-500 px-4 py-2 rounded ml-3 text-white">
                                                {
                                                    postsStatus == "loading" ? "Loading" : "نشر"
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
                                <PostDetailItem
                                    topicId={topicId}
                                    post={post}
                                    topicDetails={topicDetails}
                                    isTopic={true}
                                    // index={index}
                                    handleJumpToPost={handleJumpToPost}
                                    showReplyForm={() => { setReplyToPostNumber(post?.post_number); setFormVisible(true) }}
                                />
                                {/* <div className="my-5 flex justify-end">
                                    <div className="flex gap-2 mr-3">
                                        4 فزعات
                                    </div> 
                                    <div className="py-2 px-6 border-[1px] border-[#DDDDDD] rounded-lg text-[#666666]">
                                        رتب حسب<b> الأحدث</b>
                                    </div>
                                </div> */}
                                {topicPosts.map((post) => {
                                    return (
                                        <div key={post.id} ref={(el) => postRefs.current[post.post_number] = el} >
                                            <PostDetailItem
                                                key={post.id}
                                                topicId={topicId}
                                                post={post}
                                                topicDetails={topicDetails}
                                                isTopic={false}
                                                handleJumpToPost={handleJumpToPost}
                                                showReplyForm={() => { setReplyToPostNumber(post?.post_number); setFormVisible(true) }}
                                            // index={index}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {isLoggedin && (
                            <div className="flex gap-4 mt-[2rem]">
                                <div className="bg-[#004D5A] cursor-pointer flex gap-2 flex-grow-0 px-9 py-3 rounded-md" onClick={() => setFormVisible(true)}>
                                    <img src="/images/post/link-forward.svg" className="w-[17px]" alt="" />
                                    <span className="text-white">رد</span>
                                </div>
                                <div className="border-[1px] cursor-pointer border-[#96EDD9] px-9 py-3 flex flex-grow-0 rounded-md" onClick={() => handleMainCopy(`${process.env.REACT_APP_URL}/detail/${topicId}/${postNumber}`)}>
                                    <img src="/images/post/paper-clip.svg" alt="" />
                                    <span className="text-[#004D5A] font-medium">شارك</span>
                                </div>
                                <div className="relative">
                                    {showCopytooltip && (
                                        <div
                                            className="absolute bottom-[4rem] left-[5rem] transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow"
                                            style={{ whiteSpace: "nowrap" }}
                                        >
                                            !Copied
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {suggestedTopics && suggestedTopics.length > 0 && (

                            <div className="mt-[6rem]">
                                <span className="text-[18px] text-[#333333] font-medium">مواضيع مشابهة</span>
                                <div className="mt-[2rem]">
                                    {
                                        suggestedTopics.map((topic) => (
                                            <PostItem
                                                key={topic.id}
                                                post={topic}
                                                index={topic.id}
                                            />
                                        ))
                                    }
                                </div>
                            </div>

                        )}
                    </div>
                </div>
                <Sidebar categoryId={-1} />
            </div>

        </>

    );
};

export default PostDetails;