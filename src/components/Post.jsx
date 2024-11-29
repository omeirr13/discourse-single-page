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
        <div className="border border-gray-300 rounded-lg p-4 mt-3 bg-white">
            <div className="flex items-start mb-4">
                <div className="mr-4 flex justify-between w-full">
                    <div className="flex gap-3">
                        <img src="/images/profile-pic.svg" />
                        <p className="font-semibold text-gray-800 text-right">{post.username}</p>
                    </div>
                    <div className="flex gap-3 w-44 justify-between ml-3">
                        <div
                            onClick={handleDelete}
                            className="text-gray-500 hover:text-red-600 focus:outline-none mt-1 mr-2 cursor-pointer"
                            aria-label="Delete"
                        >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4 mb-3" />
                        </div>
                        <p className="text-sm text-gray-500 text-right">{date}</p>
                    </div>
                </div>
            </div>

            <div
                className="content text-right text-gray-700 mb-4 mr-5"
                dangerouslySetInnerHTML={{ __html: post.cooked }}
            />
            <div className="flex gap-5 mr-5">
                <div className="flex gap-1">
                    <span className="mb-1">14</span>
                    <img src="/images/like.svg" className="cursor-pointer" />
                </div>
                <div className="flex gap-1">
                    <span className="mb-1">رد</span>
                    <img src="/images/reply.svg" className="cursor-pointer"/>
                </div>
            </div>
        </div>
    );
};
export default Post;