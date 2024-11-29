import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Post = ({ post, index, handleDelete }) => {
    return (
        <div className="border border-gray-300 rounded-lg p-4 mt-3 bg-white">
            <div className="flex items-start mb-4">
                <strong>{index + 1})</strong>
                <div className="mr-4">
                    <p className="font-semibold text-gray-800 text-right">{post.username}</p>
                    <p className="text-sm text-gray-500 text-right">{post.time}</p>
                </div>
                <div
                    onClick={handleDelete}
                    className="text-gray-500 hover:text-red-600 focus:outline-none mt-1 mr-2 cursor-pointer"
                    aria-label="Delete"
                >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </div>
            </div>

            <div
                className="content text-right text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: post.cooked }}
            />
        </div>
    );
};
export default Post;