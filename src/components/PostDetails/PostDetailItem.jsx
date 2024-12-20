import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { acceptUnAcceptSolution, toggleBookmarkPost, toggleLike } from '../../redux/features/topicsSlice';
import { setIndiLoading } from '../../redux/features/loadingSlice';

const PostDetailItem = ({ topicId, post, topicDetails, isTopic, handleJumpToPost, showReplyForm }) => {
    const username = post?.topic_creator?.username;
    const image = post?.avatar_template;
    const dispatch = useDispatch();

    const { topicHasAcceptedSolution } = useSelector((state) => state.topics);

    //this component can either be topic and can also be a post...posts can have replies...
    function removeMetaDivs(content) {
        // Split the content into lines or segments
        const segments = content?.split(/(?=<div)/g); // Split by opening <div>

        // Filter out any segment that represents a <div> with class "meta"
        const filteredSegments = segments?.filter(segment => {
            return !/<div[^>]*class=['"]?meta['"]?[^>]*>/.test(segment);
        });

        // Join the filtered segments back into a string
        return filteredSegments?.join('');
    }
    const poster_image = `${process.env.REACT_APP_API_URL + image?.replace("{size}", "28")}`;

    const [showReplies, setShowReplies] = useState(false);
    // const [isSolutionMarked, setIsSolutionMarked] = useState(false);

    const [loadingReplies, setLoadingReplies] = useState(false);
    const [errors, setErrors] = useState([]);
    const [replies, setReplies] = useState(null);

    //admin validation checks

    const userObj = localStorage.getItem("salla_discourse_user");
    const user = JSON.parse(userObj);
    let isLoggedin = false;
    let isAdmin = false;
    if (user) {
        isLoggedin = true;
        if (user.admin) {
            isAdmin = true
        }
    }

    const fetchPostReplies = async (postId) => {
        try {
            setLoadingReplies(true);
            const userObj = localStorage.getItem("salla_discourse_user");
            const user = JSON.parse(userObj);
            let username = process.env.REACT_APP_API_USERNAME;
            if (user) {
                username = user.username;
            }
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}/replies`, {
                headers: {
                    'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                    'Api-Username': username,
                    'Content-Type': 'application/json'
                }
            });
            const replies = response.data;
            setReplies(replies);
            setLoadingReplies(false);
        } catch (err) {
            setErrors(err);
        }
    };

    const handleToggleReplies = async () => {
        if (!showReplies && !replies) {
            await fetchPostReplies(post.id);
        }
        setShowReplies(prev => !prev);
    }

    const replied_to_image = post?.reply_to_user?.avatar_template;
    const reply_to_user_image = `${process.env.REACT_APP_API_URL + replied_to_image?.replace("{size}", "28")}`;

    const handleBookmarkPost = async () => {
        dispatch(setIndiLoading({ actionType: "bookmark", postId: post.id, value: true }));

        await dispatch(toggleBookmarkPost(post, isTopic));

        dispatch(setIndiLoading({ actionType: "bookmark", postId: post.id, value: false }));
    }
    const handleSolution = async (post) => {

        dispatch(setIndiLoading({ actionType: "solution", postId: post.id, value: true }));

        await dispatch(acceptUnAcceptSolution(post))

        dispatch(setIndiLoading({ actionType: "solution", postId: post.id, value: false }));
    }
    const { loading } = useSelector((state) => state.loading);

    const [showTooltip, setShowTooltip] = useState(false);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setShowTooltip(true);

            // Hide the tooltip after 2 seconds
            setTimeout(() => setShowTooltip(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const togglePostReaction = async (postId, reaction) => {
        try {
            dispatch(setIndiLoading({ actionType: "react", postId, value: true }));

            const userObj = localStorage.getItem("salla_discourse_user");
            const user = JSON.parse(userObj);
            let username = process.env.REACT_APP_API_USERNAME;
            if (user) {
                username = user.username;
            }

            const url = `${process.env.REACT_APP_API_URL}/discourse-reactions/posts/${postId}/custom-reactions/${reaction}/toggle.json`;

            const response = await axios.put(url, {}, {
                headers: {
                    'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                    'Api-Username': username,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.data.errors) {

                const reactions = response.data.reactions;
                await dispatch(toggleLike({ isTopic, postId: post?.id, reactions }));
            }

        } catch (err) {
            console.error('Error toggling reaction:', err);
            setErrors(err); // Optionally handle errors
        }

        dispatch(setIndiLoading({ actionType: "react", postId, value: false }));
    };

    const reactions = [
        { emoji: '❤️', label: 'heartpulse' },
        { emoji: '👍', label: '+1' },
        { emoji: '😆', label: 'laughing' },
        { emoji: '😮', label: 'open_mouth' },
        { emoji: '👏', label: 'clap' },
        { emoji: '🤗', label: 'hugs' },
        { emoji: '😘', label: 'kissing_heart' },
    ];

    const handleReactionClick = async (postId, reaction) => {
        await togglePostReaction(postId, reaction.label);
        // dispatch();
        console.log('Selected reaction:', reaction);
    };

    const reactionsMap = {};
    post?.reactions?.forEach((reaction) => {
        reactionsMap[reaction.id] = reaction.count;
    });
    const Reaction = ({ reaction }) => {
        return (
            <button
                key={reaction.label}
                className="p-1 hover:bg-gray-100 rounded-full"
            >
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <p
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-200 text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {reactionsMap[reaction.label]}
                        </p>
                        <span
                            role="img"
                            aria-label={reaction.label}
                            className="cursor-pointer"
                        >
                            {reaction.emoji}
                        </span>
                    </div>
                </div>

            </button>
        )
    }
    return (
        <div className="border-gray-300 rounded-lg mt-3 bg-white" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div className="p-4">
                {isTopic && (
                    <>
                        <div className="flex gap-8 pb-5">
                            <div className="flex gap-3 items-center">
                                <p className="w-auto h-auto text-[14px] text-[#444444]">#{post?.category?.name}</p>
                            </div>
                            {/* <div>
                                <p># الضريبة</p>
                            </div> */}
                        </div>
                        <span className="text-[24px] font-bold">
                            {topicDetails?.title}
                        </span>
                    </>
                )}
                <div className={`flex items-start mb-4 ${isTopic ? 'pt-5' : ''}`}>
                    <div className="mr-4 flex justify-between w-full">
                        <div className="flex gap-3 items-start">
                            {/* <img src={poster_image} className="w-[50px] h-[50px]" /> */}
                            <img src={poster_image} className="w-[44px] h-[44px] rounded-full" alt="" />
                            <div className="flex-col">
                                <div>
                                    <span className="text-[#444444] text-[16px] font-bold">{username}</span>
                                </div>
                                {replied_to_image && (
                                    <div className="flex sm:hidden gap-3 ml-8">
                                        <img src="/images/post/arrow-turn-back.svg" alt="" />
                                        <img src={reply_to_user_image} className="w-[24px] h-[24px] rounded-full" alt="" />
                                        <p className="text-[#666666] font-bold">{post?.reply_to_user?.username}</p>
                                    </div>
                                )}
                                <div
                                    className="content text-right text-[#707070] mb-4 mt-3"
                                    dangerouslySetInnerHTML={{ __html: removeMetaDivs(post.cooked) }}
                                />
                            </div>
                        </div>
                    </div>
                    {replied_to_image && (
                        <div className="hidden sm:flex gap-3 ml-8">
                            <img src="/images/post/arrow-turn-back.svg" alt="" />
                            <img src={reply_to_user_image} className="w-[24px] h-[24px] rounded-full" alt="" />
                            <p className="text-[#666666] font-bold">{post?.reply_to_user?.username}</p>
                        </div>
                    )}
                </div>

            </div>


            <div className={`flex sm:hidden gap-5 w-full items-center justify-between`}>
                <div className="flex flex-col items-start w-full">
                    {/* Attachment */}
                    {/* <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer">
                        <img src="/images/post/attachment.svg" />
                    </div> */}
                    <div className="flex gap-2 items-center p-3">


                        {isLoggedin && (
                            // reply
                            <>
                                <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer" onClick={showReplyForm}>
                                    <img src="/images/post/share.svg" alt="" />
                                </div>

                                {/* likes */}
                                <div className="relative inline-block group">
                                    {/* Icon that triggers the reactions bar */}
                                    <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer">

                                        {loading.react[post.id] ? (
                                            <img src="/images/loader.gif" alt="Loading..." className="w-[12px] h-[15px]" />
                                        ) : (
                                            !post?.yours ? (
                                                <img src="/images/post/heart.svg" alt="Heart" />
                                            ) : (
                                                <img src="/images/post/heart-cross.svg" alt="Heart Cross" />
                                            )
                                        )}


                                    </div>

                                    {/* Reactions bar */}
                                    {!post?.yours && (

                                        <div className="hidden absolute bottom-full left-1/2 transform -translate-x-1/2 space-x-2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg group-hover:flex">
                                            {reactions?.map((reaction) => (
                                                <button
                                                    key={reaction.label}
                                                    className="p-1 hover:bg-gray-100 rounded-full"
                                                    onClick={() => handleReactionClick(post?.id, reaction)}
                                                >
                                                    <span role="img" aria-label={reaction.label}>
                                                        {reaction.emoji}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* bookmarks */}
                                <div
                                    className={`relative flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer ${post?.bookmarked ? "px-[15px] py-[12px]" : ""
                                        }`}
                                    onClick={() => handleBookmarkPost()}>
                                    {loading.bookmark[post.id] ? (
                                        <img src="/images/loader.gif" alt="Loading..." className="w-[12px] h-[15px]" />
                                    ) : (
                                        <>
                                            {post?.bookmarked ? (
                                                <img
                                                    src="/images/post/save-filled.svg"
                                                    className="w-[12px] h-[15px]"
                                                    alt="Bookmarked"
                                                />
                                            ) : (
                                                <img src="/images/post/save.svg" alt="Save" />
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}


                        {/* Tooltip */}
                        <div className="relative flex justify-center items-center">
                            <div
                                className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer"
                                onClick={() => handleCopy(`${process.env.REACT_APP_URL}/detail/${topicId}/${post.post_number}`)}
                            >
                                <img src="/images/post/paperclip.svg" alt="" />
                            </div>
                            {showTooltip && (
                                <div
                                    className="absolute top-[-30px] left-[50%] transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    !Copied
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`pl-4 flex ${post?.reply_count > 0 ? 'justify-between w-full pb-2' : 'justify-end'}`}>
                        {/* replies */}
                        <div className="flex gap-2">


                            {isTopic ? (
                                <></>
                            ) : (
                                post?.reply_count > 0 &&
                                (
                                    <div className="cursor-pointer bg-[#eefcf9] text-[#004D5A] mr-3 rounded-lg" onClick={() => handleToggleReplies()}>
                                        <div className="flex gap-2 font-medium p-2 items-center">
                                            <span>{post?.reply_count}</span>
                                            <span>ردود</span>
                                            {loadingReplies ?
                                                <img src="/images/loader.gif" alt="Loading..." className="w-4 h-4" />
                                                :
                                                <img
                                                    src={`/images/post/arrow-up.svg`} alt=""
                                                    className={`cursor-pointer hidden sm:block ${showReplies ? 'rotate-180' : ''}`}

                                                />
                                            }

                                        </div>
                                    </div>
                                )
                            )}

                            {isLoggedin && isAdmin && (
                                loading.solution[post.id] ? (
                                    <img src="/images/loader.gif" alt="Loading..." className="w-[12px] h-[15px]" />
                                ) : (
                                    <>
                                        {post?.accepted_answer && (
                                            <div
                                                onClick={() => handleSolution(post)}
                                                className="flex gap-1 justify-center items-center border-[1px] p-[9px] cursor-pointer rounded-sm border-[#EEEEEE]"
                                            >
                                                <p className="text-[#707070]">حل العلامة</p>
                                                <img src="/images/post/filled-tick.svg" alt="" className="w-4 h-4" />
                                            </div>
                                        )}
                                        {!isTopic && !topicHasAcceptedSolution && (
                                            <div
                                                onClick={() => handleSolution(post)}
                                                className="flex gap-1 justify-center items-center border-[1px] p-[9px] cursor-pointer rounded-sm border-[#EEEEEE]"
                                            >
                                                <p className="text-[#707070]">حل العلامة</p>
                                                <img src="/images/post/tick.svg" alt="" className="w-4 h-4" />
                                            </div>
                                        )}
                                    </>
                                )
                            )}
                            {/* reactions */}
                            {reactions?.map((reaction) =>
                                reactionsMap[reaction.label] ? <Reaction reaction={reaction} /> : null
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <div className={`hidden sm:flex gap-5 w-full items-center justify-between`}>
                <div className="flex">
                    {isTopic ? (
                        <></>
                    ) : (
                        post?.reply_count > 0 &&
                        (
                            <div className="cursor-pointer bg-[#eefcf9] text-[#004D5A] mr-3 rounded-lg" onClick={() => handleToggleReplies()}>
                                <div className="flex gap-2 font-medium p-2 items-center">
                                    <span>{post?.reply_count}</span>
                                    <span>ردود</span>
                                    {loadingReplies ?
                                        <img src="/images/loader.gif" alt="Loading..." className="w-4 h-4" />
                                        :
                                        <img
                                            src={`/images/post/arrow-up.svg`} alt=""
                                            className={`cursor-pointer hidden sm:block ${showReplies ? 'rotate-180' : ''}`}

                                        />
                                    }

                                </div>
                            </div>
                        )
                    )}
                    <div className="w-[228px] p-2">
                        {reactions?.map((reaction) =>
                            reactionsMap[reaction.label] ? <Reaction reaction={reaction} /> : null
                        )}
                    </div>
                </div>

                <div className="p-3 flex gap-2 items-center">
                    {/* Attachment */}
                    {/* <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer">
                        <img src="/images/post/attachment.svg" />
                    </div> */}

                    {isLoggedin && isAdmin && (
                        loading.solution[post.id] ? (
                            <img src="/images/loader.gif" alt="Loading..." className="w-[12px] h-[15px]" />
                        ) : (
                            <>
                                {post?.accepted_answer && (
                                    <div
                                        onClick={() => handleSolution(post)}
                                        className="flex gap-1 justify-center items-center border-[1px] p-[9px] cursor-pointer rounded-sm border-[#EEEEEE]"
                                    >
                                        <p className="text-[#707070]">حل العلامة</p>
                                        <img src="/images/post/filled-tick.svg" alt="" className="w-4 h-4" />
                                    </div>
                                )}
                                {!isTopic && !topicHasAcceptedSolution && (
                                    <div
                                        onClick={() => handleSolution(post)}
                                        className="flex gap-1 justify-center items-center border-[1px] p-[9px] cursor-pointer rounded-sm border-[#EEEEEE]"
                                    >
                                        <p className="text-[#707070]">حل العلامة</p>
                                        <img src="/images/post/tick.svg" alt="" className="w-4 h-4" />
                                    </div>
                                )}
                            </>
                        )
                    )}

                    {isLoggedin && (
                        // reply
                        <>
                            <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer" onClick={showReplyForm}>
                                <img src="/images/post/share.svg" alt="" />
                            </div>

                            {/* likes */}
                            <div className="relative inline-block group">
                                {/* Icon that triggers the reactions bar */}
                                <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer">

                                    {loading.react[post.id] ? (
                                        <img src="/images/loader.gif" alt="Loading..." className="w-[12px] h-[15px]" />
                                    ) : (
                                        !post?.yours ? (
                                            <img src="/images/post/heart.svg" alt="Heart" />
                                        ) : (
                                            <img src="/images/post/heart-cross.svg" alt="Heart Cross" />
                                        )
                                    )}


                                </div>

                                {/* Reactions bar */}
                                {!post?.yours && (

                                    <div className="hidden absolute bottom-full left-1/2 transform -translate-x-1/2 space-x-2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg group-hover:flex">
                                        {reactions?.map((reaction) => (
                                            <button
                                                key={reaction.label}
                                                className="p-1 hover:bg-gray-100 rounded-full"
                                                onClick={() => handleReactionClick(post?.id, reaction)}
                                            >
                                                <span role="img" aria-label={reaction.label}>
                                                    {reaction.emoji}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* bookmarks */}
                            <div
                                className={`relative flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer ${post?.bookmarked ? "px-[15px] py-[12px]" : ""
                                    }`}
                                onClick={() => handleBookmarkPost()}>
                                {loading.bookmark[post.id] ? (
                                    <img src="/images/loader.gif" alt="Loading..." className="w-[12px] h-[15px]" />
                                ) : (
                                    <>
                                        {post?.bookmarked ? (
                                            <img
                                                src="/images/post/save-filled.svg"
                                                className="w-[12px] h-[15px]"
                                                alt="Bookmarked"
                                            />
                                        ) : (
                                            <img src="/images/post/save.svg" alt="Save" />
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}


                    {/* Tooltip */}
                    <div className="relative flex justify-center items-center">
                        <div
                            className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer"
                            onClick={() => handleCopy(`${process.env.REACT_APP_URL}/detail/${topicId}/${post.post_number}`)}
                        >
                            <img src="/images/post/paperclip.svg" alt="" />
                        </div>
                        {showTooltip && (
                            <div
                                className="absolute top-[-30px] left-[50%] transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                !Copied
                            </div>
                        )}
                    </div>

                </div>

            </div>
            {showReplies && (
                <>
                    {replies?.map((reply) => {
                        const replier_image = `${process.env.REACT_APP_API_URL + reply?.avatar_template?.replace("{size}", "28")}`;

                        return (
                            <div className="flex flex-col">
                                {/* div for name of person who did the reply */}
                                <div className="mr-[5rem]">
                                    <div className="flex gap-3 items-center mb-2">
                                        {/* <img src={poster_image} className="w-[50px] h-[50px]" /> */}
                                        <img src={replier_image} className="w-[44px] h-[44px] rounded-full" alt="" />
                                        <div className="flex-col">
                                            <div>
                                                <span className="text-[#444444] text-[16px] font-bold">{reply?.username}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* div for the displaying the post that he replied to */}
                                <div className="mb-4 mr-[9rem]">
                                    <div className={`flex items-start bg-[#f5f5f5] p-5 rounded-lg ml-[2rem] ${isTopic ? 'pt-5' : ''}`}>
                                        <div className="flex justify-between w-full">
                                            <div className="flex gap-3 items-start">
                                                {/* <img src={poster_image} className="w-[50px] h-[50px]" /> */}
                                                <img src={poster_image} className="w-[32px] h-[32px] rounded-full" alt="" />
                                                <div className="flex-col">
                                                    <div>
                                                        <span className="text-[#444444] text-[16px] font-bold">{reply?.reply_to_user?.username}</span>
                                                    </div>
                                                    <div
                                                        className="content text-right text-[#707070] mb-4 mt-3"
                                                        // dangerouslySetInnerHTML={{ __html: removeMetaDivs(post.cooked) }}
                                                        dangerouslySetInnerHTML={{ __html: post?.cooked }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            className="content text-right text-[#707070] mb-4 mt-3"
                                            dangerouslySetInnerHTML={{ __html: reply?.cooked }}
                                        />
                                    </div>
                                    <div className="flex">
                                        <div className="border-[1px] cursor-pointer border-[#EEEEEE] flex gap-2 px-6 py-2 rounded-lg flex-grow-0 flex-shrink-0" onClick={() => handleJumpToPost(reply?.post_number)}>
                                            <img src="/images/post/arrow-down.svg" alt="" />
                                            <span className="text-[#004D5A] text-[14px] font-bold" >الانتقال للمنشور</span>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        )
                    })}
                </>
            )}
        </div>

    );
};
export default PostDetailItem;