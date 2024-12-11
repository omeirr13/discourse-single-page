import moment from 'moment';
import 'moment/locale/ar'; // Import Arabic locale

const PostDetail = ({ post }) => {

    const humanFriendlyDate = moment(post.last_posted_at).locale('ar').fromNow();
    const firstletter = post.last_poster_username.charAt(0);
    const poster_image = `${process.env.REACT_APP_API_URL}/letter_avatar_proxy/v4/letter/${firstletter}/59ef9b/48.png`
    return (
        <div className="border-gray-300 rounded-lg mt-3 bg-white">
            <div className="p-4">
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
                <div className="flex items-start mb-4 pt-5">
                    <div className="mr-4 flex justify-between w-full">
                        <div className="flex gap-3 items-start">
                            {/* <img src={poster_image} className="w-[50px] h-[50px]" /> */}
                            <img src="/images/header/smile.png" className="w-[44px] h-[44px]" />
                            <div className="flex-col">
                                <div>
                                    <span className="text-[#444444] text-[16px] font-bold">لوك عيسى</span>
                                </div>
                                <div
                                    className="content text-right text-[#707070] mb-4 mt-3"
                                    dangerouslySetInnerHTML={{ __html: post.title }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex gap-5 w-full">
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
                    {/* <p className="text-[12px] font-bold text-[#666666]">{post.last_poster_username}</p>
                    <div className="flex gap-2">
                        <img src="/images/post/paperclip.svg" />
                        <span className="mb-1">{post.posts_count}</span>
                    </div>
                    <div className="flex gap-2">
                        <img src="/images/eye.svg" />
                        <span className="mb-1">{post.views}</span>
                    </div>
                    <div className="flex gap-2">
                        <img src="/images/heart.svg" />
                        <span className="mb-1">{post.like_count}</span>
                    </div>
                    <div className="flex gap-2">
                        <img src="/images/clock.svg" />
                        <span className="mb-1">{humanFriendlyDate}</span>
                    </div> */}
                </div>
            </div>
        </div>

    );
};
export default PostDetail;