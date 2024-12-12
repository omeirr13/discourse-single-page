import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../Sidebar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { createTopic, deleteTopic, fetchCategoryPosts, resetError, setLoading } from "../../redux/features/postsSlice";
import CategoryPostItem from "./CategoryPostItem";
import { fetchCategories } from "../../redux/features/categoriesSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const CategoryPosts = () => {
    const { categoryId } = useParams();

    const [formVisible, setFormVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Search query state
    const [filterSelected, setFilterSelected] = useState("new");

    const [newPost, setNewPost] = useState({
        title: "",
        category: "",
        raw: "",
    });
    const dispatch = useDispatch();
    const { posts, status: postsStatus, error: postsError, loading: postsLoading } = useSelector((state) => state.posts);
    console.log(postsError);
    useEffect(() => {
        dispatch(fetchCategoryPosts(categoryId, filterSelected));
    }, [dispatch, categoryId, filterSelected]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPosts = posts.filter(post => post);
    const navigate = useNavigate();
    const handleFormSubmit = async (e) => {
        try {
            e.preventDefault();
            await dispatch(createTopic({ ...newPost, category: categoryId }));
            console.log(postsStatus);
            if (!postsLoading) {
                handleClose();
                navigate("/");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleClose = () => {
        setNewPost({ title: "", category: "", raw: "" });
        setEditorValue("");
        setFormVisible(false);
        dispatch(resetError());
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

    const handleChangeFilterSelected = (filter) => {
        setFilterSelected(filter);
        dispatch(fetchCategoryPosts(categoryId, filter));
    };

    const { categories, status: categoriesStatus } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories(true));
    }, [dispatch]);

    // quill
    const quillRef = useRef();
    const [editorValue, setEditorValue] = useState("");
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
        setNewPost(prevState => ({ ...prevState, raw: value }));
    }, []);

    if (categoriesStatus == "loading" || postsStatus == "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <img src="/images/loader.gif" alt="Loading..." className="w-16 h-16" />
            </div>
        );
    }

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
                                            {postsError?.map((error, index) => (
                                                <>
                                                    <span key={index} className="text-[red]"> {error}</span><br />
                                                </>
                                            ))}
                                            <label htmlFor="title" className="block text-right font-semibold text-gray-800">
                                                اكتب العنوان
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={newPost.title}
                                                onChange={(e) => { setNewPost({ ...newPost, title: e.target.value }); console.log(newPost) }}
                                                className="w-full h-[54px] p-2 border border-gray-300 rounded-lg mt-2"
                                                placeholder="اكتب عنوان مختصر يقدم نبذه عن الموضوع"
                                            />


                                        </div>
                                        {/* <div className="mb-4 h-[54px] flex items-center border gap-4 border-gray-300 rounded-md p-2">
                                            {categories.map((category) => {
                                                return (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id="sections"
                                                            name="options"
                                                            className="form-radio ml-2 w-3 h-3  border-gray-300 focus:ring-0"
                                                        />
                                                        <label
                                                            htmlFor="sections"
                                                            className="ml-2 text-[#666666] font-medium"
                                                        >
                                                            {category.name}
                                                        </label>
                                                    </div>
                                                )
                                            })}
                                        </div> */}



                                        <div className="mb-4">
                                            <label htmlFor="content" className="block text-right font-semibold mb-3 text-gray-800">
                                                اكتب موضوعك هنا:
                                            </label>
                                            {/* <ReactQuill
                                                value={newPost.raw}
                                                onChange={(raw) => setNewPost({ ...newPost, raw })}
                                                className="p-2 rounded-lg"
                                                theme="snow"
                                                dir="rtl"
                                            /> */}
                                            <ReactQuill
                                                theme="snow"
                                                ref={quillRef}
                                                value={editorValue} // Bind the state to value
                                                modules={modules}
                                                onChange={handleChange}
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
                                جماعة سلا
                            </span>

                            {/* <p className="mt-4 text-center hidden sm:block text-[#707070]">
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
                            /> */}

                            <button type="submit" className="btn px-8 py-3 text-[14px] mt-9 font-bold rounded-lg text-[#004D5A] hover:underline w-[185px] h-[52px]" onClick={() => setFormVisible(true)}>
                                أضف سؤال جديد +
                            </button>
                        </div>

                        <div className="flex justify-center">
                            {/* right part */}
                            <div className="w-full mt-4">
                                <div className="hidden sm:block m-3">
                                    <div className="flex gap-5 items-center">
                                        <span className={filterSelected === "new" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2 cursor-pointer` : `text-[#666666] cursor-pointer`} onClick={() => handleChangeFilterSelected("new")}>جديد</span>
                                        <span className={filterSelected === "latest" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2 cursor-pointer` : `text-[#666666] cursor-pointer`} onClick={() => handleChangeFilterSelected("latest")}>الأكثر مشاهدة</span>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    {filteredPosts.length === 0 ? (
                                        <div>أُووبس! لا توجد مشاركات جديدة</div>
                                    ) : (
                                        filteredPosts.map((post, index) => (
                                            <CategoryPostItem
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
                <Sidebar categories={categories} categoryId={categoryId} />
            </div>

        </>

    );
};

export default CategoryPosts;
