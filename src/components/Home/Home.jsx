import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import HomePost from "./HomePost";
import Sidebar from "../Sidebar";
import { deleteTopic, fetchPosts, fetchCategoryPosts, createTopic, resetError } from "../../redux/features/postsSlice";
import { fetchCategories } from "../../redux/features/categoriesSlice";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import axios from "axios";
const Home = () => {
    const { posts, status: postsStatus, error: postsError, loading: postsLoading } = useSelector((state) => state.posts);
    const { categories, status: categoriesStatus } = useSelector((state) => state.categories);

    const userObj = localStorage.getItem("salla_discourse_user");
    const user = JSON.parse(userObj);


    const combinedCategories = categories?.reduce((acc, category) => {
        acc.push(category);
        if (category.subcategory_count > 0 && Array.isArray(category.subcategory_list)) {
            acc.push(...category.subcategory_list);
        }

        return acc;
    }, []);

    const filteredUserCategories = user && user.admin
        ? combinedCategories
        : combinedCategories.filter(item => item.only_admin_can_post === false);

    const [searchQuery, setSearchQuery] = useState(""); // Search query state

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editorValue, setEditorValue] = useState("");
    const modalRef = useRef(null);
    const quillRef = useRef();

    let is_userLoggedIn = false;

    if (user) {
        is_userLoggedIn = true;
    }
    // const { posts, status: postsStatus } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPosts = posts.filter(
        (post) => post
        // post.title.toLowerCase().includes(searchQuery.toLowerCase()) 
        // post.cooked.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [sortSelected, setSortSelected] = useState("new");
    const handleChangeSortSelected = (sort) => {
        setSortSelected(sort);
        if (filterSelected) {
            dispatch(fetchCategoryPosts(filterSelected, sort));
        }
        else {
            dispatch(fetchPosts(sort));
        }
    }

    const [filterSelected, setFilterSelected] = useState("");

    const handleFilterSelect = (category) => {
        setFilterSelected(category);
        if (category) {
            dispatch(fetchCategoryPosts(category, sortSelected))
        }
        else {
            dispatch(fetchPosts(sortSelected));
        }
    };

    // const DefaultPostSearch = () => {
    //     return (
    //         <div>
    //             <div>
    //                 <div className="flex gap-3 items-center">
    //                     <img src="/images/sidebar/arrow-right.svg" />
    //                     <img src="/images/sidebar/bandages.png" className="w-4 h-4" />
    //                     <p className="font-bold w-auto h-auto text-[14px] text-[#444444]">محتاج فزعتكم</p>

    //                 </div>
    //                 {/* <p className="text-[#707070] mt-2">انشئ مجتمع سلة ليكون المكان الأمثل والأكثر موثوقية للتجارة، لتبادل الافكار  والخبرات</p> */}
    //             </div>
    //             {/* <input
    //                 type="text"
    //                 className="mr-4 mt-5 border-[#BBBBBB] border-[1px] border-solid rounded-[8px] h-[45px] w-[50vw] pr-[3vw] pl-4"
    //                 placeholder="ابحث عن سؤالك هنا ..."
    //                 style={{
    //                     backgroundImage: "url('/images/sidebar/search.png')",
    //                     backgroundSize: '20px 20px',
    //                     backgroundRepeat: 'no-repeat',
    //                     backgroundPosition: '47.5vw center',
    //                 }}
    //             /> */}

    //         </div>
    //     )
    // }

    const HomeSuggestedPost = () => {
        return (
            <div className="flex flex-col items-center mt-[18px]">
                <div className="flex gap-3 items-start justify-end mb-4">
                    <p className="text-[#333333] mt-[10px] font-semibold">
                        don’t miss it👋
                    </p>
                    <div className="w-[94px] h-[1px] mx-4 bg-[#E6E6E6] mt-[24px]"></div>
                    <div className="bg-white rounded-full border-[1px] border-[#EEEEEE]">
                        <img src={`/images/arrow-left.svg`} alt="Arrow left" className="cursor-pointer rotate-180 p-4" />
                    </div>
                    <div className="bg-white rounded-full border-[1px] border-[#EEEEEE]">
                        <img src={`/images/arrow-left.svg`} alt="Arrow left" className="cursor-pointer p-4" />
                    </div>
                </div>
                <div className="bg-white rounded-lg m-8 mt-1 px-3 py-2" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <div className="flex flex-col gap-3">
                        <div className="mt-2">
                            <span className="bg-[#83ECFF]  text-[#207A8A] p-1 rounded-lg">التسويق الالكتروني</span>
                        </div>
                        <img src="/images/home/suggested1.png" alt="suggested" />
                        <p className="text-[#333333] text-[18px]">ورشة عمل: كيفية تحقيق التوازن بين المبيعات والتسويق</p>
                        <p className="text-[#333333] text-[14px] font-medium">أحمد مصطفى مدرب التنمية البشرية </p>
                        <div className="flex">
                            <img src="/images/home/calendar.svg" alt="calender" className="ml-1" />
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
                        <img src={`/images/arrow-left.svg`} alt="" className="cursor-pointer rotate-180 p-4" />
                    </div>
                    <div className="bg-white rounded-full border-[1px] border-[#EEEEEE]">
                        <img src={`/images/arrow-left.svg`} alt="" className="cursor-pointer p-4" />
                    </div>
                </div>
                <div className="bg-white rounded-lg m-8 mt-1 px-3 py-2" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <div className="flex flex-col">
                        <img src="/images/home/suggested2.png" alt="" />
                        <p className="text-[#666666] text-[16px] font-bold mt-2">تحسين تجربة المستخدم</p>
                        <p className="text-[#333333] text-[14px] font-normal line-clamp-2">
                            تحسين تجربة المستخدم في متجرك الإلكتروني أحد العناوين الأساسية في مهمتك لجذب المزيد من العملاء، وتعزيز ولائهم للمتجر، وإليك عدّة نصائح تساعدك في مهمّة
                        </p>

                        <div className="flex mt-4 justify-between">
                            <div className="mt-2 flex gap-2 items-center bg-[#FFF7DF] rounded-md px-2 max-h-fit">
                                <img src="/images/home/star.png" alt="" className="w-[16px] h-[16px]" />
                                <span className="text-[#A46F29] text-[14px] font-medium p-1 rounded-lg">مواضيع مميزة</span>
                            </div>
                            <div className="p-3 flex gap-8">
                                <div className="flex gap-2 items-center">
                                    <img src="/images/home/like.svg" alt="" className="cursor-pointer" />
                                    <span className="mb-1 text-[#999999]">14</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/images/home/cloud.svg" alt="" className="cursor-pointer" />
                                    <span className="mb-1 text-[#999999]">12</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const [formVisible, setFormVisible] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        category: filteredUserCategories?.length > 0 ? filteredUserCategories[0].id : "",
        raw: "",
    });
    const handleFormSubmit = async (e) => {
        try {
            e.preventDefault();
            await dispatch(createTopic({ ...newPost }));
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

    useEffect(() => {
        dispatch(fetchCategories(true));
    }, [dispatch]);

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

    if (categoriesStatus === "loading" || postsStatus === "loading") {
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
                                                onChange={(e) => { setNewPost({ ...newPost, title: e.target.value }); }}
                                                className="w-full h-[54px] p-2 border border-gray-300 rounded-lg mt-2"
                                                placeholder="اكتب عنوان مختصر يقدم نبذه عن الموضوع"
                                            />


                                        </div>
                                        <div className="mb-4 grid grid-cols-5 gap-4 border border-gray-300 rounded-md p-4">
                                            {filteredUserCategories?.map((category) => (
                                                <div className="flex items-center" key={category.id}>
                                                    <input
                                                        type="radio"
                                                        id={`category-${category.id}`} // Corrected syntax for unique ID
                                                        name="options"
                                                        onChange={() => {
                                                            setNewPost({ ...newPost, category: category.id });
                                                        }}
                                                        className="form-radio ml-2 w-3 h-3 border-gray-300 focus:ring-0"
                                                        checked={newPost.category === category.id}
                                                    />
                                                    <label
                                                        htmlFor={`category-${category.id}`} // Corrected syntax for matching ID
                                                        className="ml-2 text-[#666666] font-medium"
                                                    >
                                                        {category.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>




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
                            {is_userLoggedIn && (
                                <button type="submit" className="btn px-8 py-3 text-[14px] mt-9 font-bold rounded-lg text-[#004D5A] hover:underline w-[185px] h-[52px]" onClick={() => setFormVisible(true)}>
                                    أضف سؤال جديد +
                                </button>
                            )}
                        </div>

                        <div className="flex justify-center">


                            {/* right part */}
                            <div className="w-full mt-4">
                                <div className="hidden sm:flex justify-between m-3">
                                    <div className="flex gap-5 items-center">
                                        <span className={sortSelected === "new" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2 cursor-pointer` : `text-[#666666] cursor-pointer`} onClick={() => handleChangeSortSelected("new")}>جديد</span>
                                        <span className={sortSelected === "latest" ? `text-[#333333] border-b-[2px] border-[#999999] pb-2 cursor-pointer` : `text-[#666666] cursor-pointer`} onClick={() => handleChangeSortSelected("latest")}>الأكثر مشاهدة</span>
                                    </div>
                                    <div className=" mt-2 border  rounded-lg shadow-lg w-56 bg-white">
                                        <div className="flex flex-col p-2">
                                            <select
                                                className="w-full text-left px-2 py-2 rounded-md border"
                                                onChange={(e) => handleFilterSelect(e.target.value)}
                                                value={filterSelected}>
                                                <option value="">حدد عامل التصفية</option>
                                                {categories?.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-2">
                                    {filteredPosts.length === 0 ? (
                                        <div>أُووبس! لا توجد مشاركات جديدة</div>
                                    ) : (
                                        filteredPosts.map((post, index) => (
                                            <HomePost
                                                key={post.id}
                                                post={post}
                                                index={index}
                                                handleDelete={() => { dispatch(deleteTopic(post.id)) }}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* left part */}
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
                <Sidebar categoryId={-1} />
            </div>

        </>

    );
};

export default Home;
