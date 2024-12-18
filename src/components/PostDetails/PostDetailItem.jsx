import moment from 'moment';
import 'moment/locale/ar'; // Import Arabic locale
import { useNavigate } from 'react-router-dom';

const PostDetailItem = ({ post }) => {

    function extractTextAndTruncate(description) {
        // Remove all image tags
        const textWithoutImages = description.replace(/<img[^>]*>/g, '');

        // Truncate the text to 100 characters
        const truncatedText = textWithoutImages.slice(0, 100);

        return truncatedText;
    }
    const navigate = useNavigate();
    const humanFriendlyDate = moment(post.last_posted_at || post.created_at).locale('ar').fromNow();
    const poster_image = `${process.env.REACT_APP_API_URL + post.topic_creator?.avatar.replace("{size}", "28")}`;
    return (
        <div  onClick={() => { navigate(`/detail/${post.id}`) }} className="border-[#DDDDDD] cursor-pointer border-[1px] border-l-0 border-t-0 border-r-0 bg-white rounded-lg m-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div className="p-4 pb-0">
                <div className="flex items-start mb-4">
                    <div className="flex justify-between w-full">
                        <div className="flex justify-between w-full">
                            <div className="flex gap-3" alt="">
                                <img src={poster_image} alt="" className="w-[44px] h-[44px] rounded-full" />

                                <div className="flex-col">
                                    <div className="flex gap-3 text-[14px] font-medium">
                                        <p className="text-[#444444] font-medium">{post.topic_creator?.username}</p>
                                        <span className="mb-1 text-[#999999]">{post.category?.name}</span>
                                        {post.has_accepted_answer && (
                                            <div className="bg-[#EFFBF6] rounded-full">
                                            <div className="flex gap-2 px-3">
                                                <img src="/images/home/tick.svg" alt="" />
                                                <span className="mb-1 text-[#008C56] font-medium">تم الاجابة</span>
                                            </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className='font-bold'>{post.title || post.topic_creator.title} </p>
                                    <div
                                        className="content text-right text-[#707070] mb-4 mt-3"
                                        dangerouslySetInnerHTML={{ __html: extractTextAndTruncate(post.cooked || '') }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div className="flex gap-5 w-full justify-between">
                <div className="p-3 flex gap-8">
                    <div className="flex gap-2 items-center">
                        <img src="/images/home/like.svg" alt="" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">{post.like_count}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <img src="/images/home/cloud.svg" alt="" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">{post.posts_count - 1}</span>
                    </div>
                    <div className="flex gap-2">
                        <img src="/images/home/eye.svg" alt="" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">{post.views}</span>
                    </div>
                </div>

                <div className="p-3 flex gap-8">
                    <div className="flex gap-2 items-center">
                        {post.bookmarked ? (
                            <img src="/images/post/save-filled.svg" alt="" className="cursor-pointer" />
                        ) : (
                            <img src="/images/home/save.svg" alt="" className="cursor-pointer" />
                        )}
                        
                        <span className="mb-1 text-[#999999]">اقرأ لاحقاً</span>
                    </div>
                    {/* <div className="flex gap-2 items-center">
                        <img src="/images/home/share.svg" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">انشر</span>
                    </div> */}
                    <div className="flex gap-2">
                        <img src="/images/home/clock.svg" alt="" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">{humanFriendlyDate}</span>
                    </div>
                </div>

            </div>
        </div>

    );
};
export default PostDetailItem;