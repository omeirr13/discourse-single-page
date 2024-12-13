import moment from 'moment';
import 'moment/locale/ar'; // Import Arabic locale
import { useState } from 'react';

const PostDetail = ({ post, isTopic, replies = [] }) => {
    //this component can either be topic and can also be a post...posts can have replies...

    function removeMetaDivs(content) {
        // Split the content into lines or segments
        const segments = content.split(/(?=<div)/g); // Split by opening <div>

        // Filter out any segment that represents a <div> with class "meta"
        const filteredSegments = segments.filter(segment => {
            return !/<div[^>]*class=['"]?meta['"]?[^>]*>/.test(segment);
        });

        // Join the filtered segments back into a string
        return filteredSegments.join('');
    }
    const humanFriendlyDate = moment(post.last_posted_at).locale('ar').fromNow();
    const firstletter = post.last_poster_username.charAt(0);
    const poster_image = `${process.env.REACT_APP_API_URL + post.topic_creator?.avatar.replace("{size}", "28")}`;

    const [showReplies, setShowReplies] = useState(false);
    return (
        <div className="border-gray-300 rounded-lg mt-3 bg-white" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div className="p-4">
                {isTopic && (
                    <>
                        <div className="flex gap-8 pb-5">
                            <div className="flex gap-3 items-center">
                                <p className="w-auto h-auto text-[14px] text-[#444444]">محتاج فزعتكم</p>
                            </div>
                            <div>
                                <p># الضريبة</p>
                            </div>
                        </div>
                        <span className="text-[24px] font-bold">
                            يا جماعة عندي سؤال متى افعل الضريبة لمتجري؟ وهل اواجه مشاكل اذا ما فعلته؟
                        </span>
                    </>
                )}
                <div className={`flex items-start mb-4 ${isTopic ? 'pt-5' : ''}`}>
                    <div className="mr-4 flex justify-between w-full">
                        <div className="flex gap-3 items-start">
                            {/* <img src={poster_image} className="w-[50px] h-[50px]" /> */}
                            <img src={poster_image} className="w-[44px] h-[44px] rounded-full" />
                            <div className="flex-col">
                                <div>
                                    <span className="text-[#444444] text-[16px] font-bold">لوك عيسى</span>
                                </div>
                                <div
                                    className="content text-right text-[#707070] mb-4 mt-3"
                                    dangerouslySetInnerHTML={{ __html: removeMetaDivs(post.cooked) }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className={`flex gap-5 w-full items-center ${replies.length > 0 ? 'justify-between' : 'justify-end'}`}>
                {isTopic ? (
                    <div className="flex">
                        <img src="/images/post/eye.svg" className="mr-4" />
                        <span className="pr-4 text-[#004D5A]">{post.like_count}</span>
                    </div>
                ) : (
                    replies.length > 0 &&
                    (
                        <div className="cursor-pointer bg-[#eefcf9] text-[#004D5A] mr-3 rounded-lg" onClick={() => setShowReplies(prev => !prev)}>
                            <div className="flex gap-2 font-medium p-2">
                                <span>{replies.length}</span>
                                <span>ردود</span>
                                <img
                                    src={`/images/post/arrow-up.svg`} alt=""
                                    className={`cursor-pointer hidden sm:block ${showReplies ? 'rotate-180' : ''}`}
                                    
                                />
                            </div>
                        </div>
                    )
                )}

                <div className="p-3 flex gap-2">
                    <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer">
                        <img src="/images/post/attachment.svg" />
                    </div>
                    <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer">
                        <img src="/images/post/share.svg" />
                    </div>
                    <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer">
                        <span className="pr-4 text-[#004D5A]">{post.like_count}</span>
                        <img src="/images/post/heart.svg" />
                    </div>
                    <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer">
                        <img src="/images/post/save.svg" />
                    </div>
                    <div className="flex justify-center items-center border-[1px] border-[#EEEEEE] rounded-sm cursor-pointer">
                        <img src="/images/post/paperclip.svg" />
                    </div>
                </div>

            </div>
            {showReplies && (
                <>
                    {replies?.map((reply) => {
                        return (
                            <div className="flex flex-col">
                                {/* div for name of person who did the reply */}
                                <div className="mr-[5rem]">
                                    <div className="flex gap-3 items-center mb-2">
                                        {/* <img src={poster_image} className="w-[50px] h-[50px]" /> */}
                                        <img src={poster_image} className="w-[44px] h-[44px] rounded-full" />
                                        <div className="flex-col">
                                            <div>
                                                <span className="text-[#444444] text-[16px] font-bold">{reply.replied_to}</span>
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
                                                <img src={poster_image} className="w-[32px] h-[32px] rounded-full" />
                                                <div className="flex-col">
                                                    <div>
                                                        <span className="text-[#444444] text-[16px] font-bold">لوك عيسى</span>
                                                    </div>
                                                    <div
                                                        className="content text-right text-[#707070] mb-4 mt-3"
                                                        // dangerouslySetInnerHTML={{ __html: removeMetaDivs(post.cooked) }}
                                                        dangerouslySetInnerHTML={{ __html: reply.replied_to_content }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            className="content text-right text-[#707070] mb-4 mt-3"
                                            dangerouslySetInnerHTML={{ __html: reply.reply }}
                                        />
                                    </div>
                                    <div className="flex">
                                        <div className="border-[1px] cursor-pointer border-[#EEEEEE] flex gap-2 px-6 py-2 rounded-lg flex-grow-0 flex-shrink-0">
                                            <img src="/images/post/arrow-down.svg" />
                                            <span className="text-[#004D5A] text-[14px] font-bold">الانتقال للمنشور</span>
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
export default PostDetail;