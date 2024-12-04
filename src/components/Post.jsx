import moment from 'moment';
import 'moment/locale/ar'; // Import Arabic locale

const Post = ({ post}) => {

    const humanFriendlyDate = moment(post.last_posted_at).locale('ar').fromNow();
    const firstletter = post.last_poster_username.charAt(0);
    const poster_image = `${process.env.REACT_APP_API_URL}/letter_avatar_proxy/v4/letter/${firstletter}/59ef9b/48.png`
    return (
        <div className="border-gray-300 rounded-lg mt-3 bg-white">
            <div className="p-4">
                <div className="flex items-start mb-4">
                    <div className="mr-4 flex justify-between w-full">
                        <div className="flex gap-3 items-start">
                            {/* <img src={poster_image} className="w-[50px] h-[50px]" /> */}
                            <img src="/images/profile-pic.svg" className="w-[50px] h-[50px]" />
                            <div className="flex-col">
                                <div
                                    className="content text-right text-gray-700 mb-4 mt-3"
                                    dangerouslySetInnerHTML={{ __html: post.title }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex gap-5 border-t-[1px] border-t-[#EEEEEE]-500 w-full">
                <div className="p-3 flex gap-8">
                    <p className="text-[12px] font-bold text-[#666666]">{post.last_poster_username}</p>
                    <div className="flex gap-2">
                        <img src="/images/message-cloud.svg" />
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
                        <img src="/images/clock.svg"/>
                        <span className="mb-1">{humanFriendlyDate}</span>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default Post;