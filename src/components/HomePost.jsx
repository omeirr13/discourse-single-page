import moment from 'moment';
import 'moment/locale/ar'; // Import Arabic locale

const HomePost = ({ post }) => {

    const humanFriendlyDate = moment(post.last_posted_at || post.created_at).locale('ar').fromNow();
    const poster_image = `${process.env.REACT_APP_API_URL + post.topic_creator.avatar.replace("{size}","28") }`;
    return (
        <div className="border-[#DDDDDD] border-[1px] border-l-0 border-t-0 border-r-0 bg-white rounded-lg m-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div className="p-4 pb-0">
                <div className="flex items-start mb-4">
                    <div className="flex justify-between w-full">
                        <div className="flex justify-between w-full">
                            <div className="flex gap-3">
                                <img src={poster_image} className="w-[44px] h-[44px]" />

                                <div className="flex-col">
                                    <div className="flex gap-3 text-[14px] font-medium">
                                        <p className="text-[#444444] font-medium">{post.topic_creator.username}</p>
                                        <span className="mb-1 text-[#999999]">{post.category.name}</span>
                                        {/* <div className="bg-[#EFFBF6] rounded-full">
                                            <div className="flex gap-2 px-3">
                                                <img src="/images/home/tick.svg" />
                                                <span className="mb-1 text-[#008C56] font-medium">تم الاجابة</span>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div
                                        className="content text-right text-[#707070] mb-4 mt-3"
                                        dangerouslySetInnerHTML={{ __html: post.description }}
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
                        <img src="/images/home/like.svg" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">{post.like_count}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <img src="/images/home/cloud.svg" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">{post.reply_count}</span>
                    </div>
                    <div className="flex gap-2">
                        <img src="/images/home/eye.svg" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">{post.views}</span>
                    </div>
                </div>

                <div className="p-3 flex gap-8">
                    {/* <div className="flex gap-2 items-center">
                        <img src="/images/home/save.svg" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">اقرأ لاحقاً</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <img src="/images/home/share.svg" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">انشر</span>
                    </div> */}
                    <div className="flex gap-2">
                        <img src="/images/home/clock.svg" className="cursor-pointer" />
                        <span className="mb-1 text-[#999999]">{humanFriendlyDate}</span>
                    </div>
                </div>

            </div>
        </div>

    );
};
export default HomePost;