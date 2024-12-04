import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Post = ({ post, index, handleDelete }) => {
    let date = new Date(post.created_at);
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
    const [year, month, day] = formattedDate.split(' ');
    date = `${day} ,${month} ${year}`;
    return (
        <div className="border-gray-300 rounded-lg mt-3 bg-white">
            <div className="p-4">
                <div className="flex items-start mb-4">
                    <div className="mr-4 flex justify-between w-full">
                        <div className="flex gap-3 items-start">
                            <img src="/images/profile-pic.svg" className="w-[77px] h-[77px]" />
                            <div className="flex-col">
                                <div className="flex items-center gap-2">
                                    <img src="/images/sidebar/pattiyan.png" className="w-[16px] h-[16px]" />
                                    <p className="font-semibold text-right text-[#444444]">{post.last_poster_username}</p>
                                </div>
                                <div
                                    className="content text-right text-gray-700 mb-4"
                                    dangerouslySetInnerHTML={{ __html: post.title }}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div className="flex gap-5 border-t-[1px] border-t-[#EEEEEE]-500 w-full">
                <div className="p-3 flex gap-8">
                    <p className="text-[12px] font-bold text-[#666666]">أسماء التاجري</p>
                    <div className="flex gap-1">
                        <img src="/images/message-cloud.svg" className="cursor-pointer" />
                        <span className="mb-1">12</span>
                    </div>
                    <div className="flex gap-1">
                        <img src="/images/eye.svg" className="cursor-pointer" />
                        <span className="mb-1">12</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="mb-1">14</span>
                        <img src="/images/heart.svg" className="cursor-pointer" />
                    </div>
                    <div className="flex gap-1">
                        <img src="/images/clock.svg" className="cursor-pointer" />
                        <span className="mb-1">3 س</span>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default Post;