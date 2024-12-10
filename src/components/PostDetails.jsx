import { useEffect, useRef, useState } from "react";
import Post from "./Post";
import Sidebar from "./Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/features/categoriesSlice";
import Select from "react-select";
import { createTopic, deleteTopic, fetchPosts } from "../redux/features/postsSlice";
// import PostDetail from "./PostDetail";
import LeftDetailSidebar from "./LeftDetailSidebar";

const PostDetails = () => {
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

    // if (categoriesStatus === "loading" || postsStatus == "loading") {
    //     return <p>Loading...</p>;
    // }
    return (
        <>
            <div className="flex justify-end">
                <div className="flex space-x-8 justify-end w-full">

                    <div className="p-6 mt-4 w-full border-r-[1px] border-r-[#DDDDDD]" dir="rtl">
                        <div>
                            <p className="mt-2 font-bold w-auto h-auto text-[14px] text-[#004D5A]">الرئيسية</p>
                        </div>
                        <div className="flex gap-3 w-[43vw]">
                            <p className="text-[#000000] mt-2 font-bold w-auto h-auto text-3xl">يا جماعة عندي سؤال متى افعل الضريبة لمتجري؟ وهل اواجه مشاكل اذا ما فعلته؟</p>
                        </div>
                        <div className="flex ">
                            <div className="posts-container w-[47vw] mt-[3rem]" style={{ display: 'inline-block', verticalAlign: 'top' }}>
                                {/* {posts.map((post, index) => (
                                    // <PostDetail
                                    //     key={post.id}
                                    //     post={post}
                                    //     index={index}
                                    //     handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                    // />
                                ))} */}
                            </div>

                            <LeftDetailSidebar />
                        </div>


                    </div>
                </div>
                <Sidebar />
            </div>

        </>

    );
};

export default PostDetails;
