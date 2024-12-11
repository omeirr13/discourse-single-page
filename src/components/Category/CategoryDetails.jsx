import { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { createTopic, deleteTopic, fetchCategoryPosts, fetchPosts } from "../../redux/features/postsSlice";
import CategoryPost from "./CategoryPost";
import { fetchCategories } from "../../redux/features/categoriesSlice";
import { useParams } from "react-router-dom";

const CategoryDetail = () => {
    const { categoryId } = useParams();

    const [formVisible, setFormVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Search query state
    const [newPost, setNewPost] = useState({
        title: "",
        category: "",
        raw: "",
    });

    const dispatch = useDispatch();
    const { posts, status: postsStatus, error: postsError } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchCategoryPosts(categoryId, "latest"));
    }, [dispatch]);

    const handleSelectChange = (selectedOption) => {
        setNewPost({ ...newPost, category: selectedOption });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPosts = posts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        if (filter === "new") {
            dispatch(fetchPosts("new"));
        }
        else {
            dispatch(fetchPosts("latest"));
        }

    }

    const [filterListOpen, setFilterListOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);

    const handleFilterSelect = (category) => {
        if (selectedFilter === category) {
            setSelectedFilter(null);
        } else {
            setSelectedFilter(category);
        }
    };

    const { categories, status: categoriesStatus, error: categoriesError } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories(true));
    }, [dispatch]);

    if (categoriesStatus == "loading" || postsStatus == "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src="/images/loader.gif" alt="Loading..." className="w-16 h-16" />
            </div>
        );
    }

    const MyQuillEditor = () => {
        const [newPost, setNewPost] = useState({ raw: "" });

        // Handle image upload
        const handleImageUpload = () => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
                const file = input.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append("type", "composer");
                    formData.append("synchronous", true); 
                    console.log(file);
                    formData.append("file", file);

                    const uploadUrl = `${process.env.REACT_APP_API_URL}/uploads.json`;

                    const userObj = localStorage.getItem("salla_discourse_user");
                    const user = JSON.parse(userObj);
                    console.log(user.username, user);
                    try {
                        const response = await fetch(uploadUrl, {
                            method: "POST",
                            body: formData,
                            headers: {
                                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                                'Api-Username': user.username,
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        if (!response.ok) {
                            throw new Error("Failed to upload the image.");
                        }

                        const data = await response.json();

                        // Assuming the response contains the image URL
                        const imageUrl = data.url;

                        // Insert the image URL into the editor
                        const quill = document.querySelector(".ql-editor");
                        const range = quill.getSelection();
                        quill.insertEmbed(range.index, "image", imageUrl);
                    } catch (error) {
                        console.error("Image upload failed:", error);
                    }
                }
            };
        };

        // Custom toolbar
        const modules = {
            toolbar: {
                container: [
                    ["strike", "bold"],
                    [{ size: [] }],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                    ],
                    ["link", "image"],
                    ["clean"],
                ],
                handlers: {
                    image: handleImageUpload,
                },
            },
        };

        return (
            <ReactQuill
                value={newPost.raw}
                onChange={(raw) => setNewPost({ ...newPost, raw })}
                className="p-2 rounded-lg"
                theme="snow"
                dir="rtl"
                modules={modules}
            />
        );
    };


    return (
        <>
            <div className="flex justify-end">
                <div className="flex justify-end w-full">
                    {formVisible && (
                        <div className="fixed inset-0 z-50 flex justify-center items-end bg-black bg-opacity-20">
                            <div className="flex w-[80vw] p-l6 pr-6 mt-1 bg-[#fbfdfe] shadow-lg border-t-[10px] border-t-[#004D5A]" dir="rtl" ref={modalRef}>
                                <div className="rounded-lg p-4 mb-6 w-full">
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
                                                className="w-full h-[54px] p-2 border border-gray-300 rounded-lg mt-2"
                                                placeholder="اكتب عنوان مختصر يقدم نبذه عن الموضوع"
                                            />
                                        </div>

                                        {/* <div className="mb-4">
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
                                        </div> */}

                                        <div className="mb-4">
                                            <label htmlFor="content" className="block text-right font-semibold text-gray-800">
                                                اكتب موضوعك هنا:
                                            </label>
                                            {/* <ReactQuill
                                                value={newPost.raw}
                                                onChange={(raw) => setNewPost({ ...newPost, raw })}
                                                className="p-2 rounded-lg"
                                                theme="snow"
                                                dir="rtl"
                                            /> */}
                                            <MyQuillEditor />
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
                            <div className="w-full mt-4">
                                <div className="hidden sm:flex justify-between m-3">
                                    <div className="flex gap-5">
                                        <span className={filterSelected === "new" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2` : `text-[#666666]`} onClick={() => handleChangeFilterSelected("new")}>جديد</span>
                                        <span className={filterSelected === "most viewed" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2` : `text-[#666666]`} onClick={() => handleChangeFilterSelected("most viewed")}>الأكثر مشاهدة</span>
                                    </div>
                                    <button type="submit" className="btn px-4  py-2 rounded text-white hover:underline" onClick={() => setFormVisible(true)}>
                                        Create
                                    </button>
                                </div>
                                <div className="mt-2">
                                    {filteredPosts.length === 0 ? (
                                        <div>أُووبس! لا توجد مشاركات جديدة</div>
                                    ) : (
                                        filteredPosts.map((post, index) => (
                                            <CategoryPost
                                                key={post.id}
                                                post={post}
                                                index={index}
                                                handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* <div className="w-1/3 sm:flex hidden flex-col gap-4">
                                <HomeSuggestedPost />
                                <HomeSuggestedTopic />
                                <HomeSuggestedTopic />
                            </div> */}

                        </div>
                    </div>
                    <div className="flex">


                    </div>
                </div>
                <Sidebar categories={categories} />
            </div>

        </>

    );
};

export default CategoryDetail;
