import moment from 'moment';
import 'moment/locale/ar'; // Import Arabic locale

const PostDetail = ({ post }) => {

    const humanFriendlyDate = moment(post.last_posted_at).locale('ar').fromNow();
    const firstletter = post.last_poster_username.charAt(0);
    return (
        <div className="border-[#DDDDDD] border-[1px] border-l-0 border-t-0 border-r-0 bg-white rounded-lg m-3" style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div className="p-4 pb-0">
                <div className="flex items-start mb-4">
                    <div className="flex justify-between w-full">
                        <div className="flex justify-between w-full">
                            <div className="flex gap-3">
                                <div className="w-[44px] h-[44px] bg-[#83ECFF] rounded-full flex items-center justify-center mb-1">
                                    <p className="text-[#06778B] text-[20px] font-semibold leading-none">
                                        {post.last_poster_username.charAt(0)}
                                    </p>
                                </div>

                                <div className="flex-col">
                                    <p className="text-[#444444] font-medium">لوك عيسى</p>
                                    <div
                                        className="content text-right text-[#707070] mb-4 mt-3"
                                        dangerouslySetInnerHTML={{ __html: post.title }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div className="flex gap-5 w-full">
                <div className="p-3 flex gap-8">
                    {/* <div className="flex gap-2">
                        <img src="/images/message-cloud.svg" />
                        <span className="mb-1">{post.posts_count}</span>
                    </div> */}

                    <div className="flex gap-2 items-center">
                        <span className="mb-1">{post.like_count}</span>
                        <img src="/images/heart.svg" className="cursor-pointer" />
                    </div>
                    <div className="flex gap-2">
                        <span className="mb-1">رد</span>
                        <img src="/images/reply.svg" className="cursor-pointer" />
                    </div>
                    {/* <div className="flex gap-2">
                        <img src="/images/clock.svg" />
                        <span className="mb-1">{humanFriendlyDate}</span>
                    </div> */}
                </div>
            </div>
        </div>

    );
};
export default PostDetail;