import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { logger } from 'redux-logger';

const topicsSlice = createSlice({
    name: 'topics',
    initialState: {
        topicPosts: [], // Stores posts related to the topic
        suggestedTopics: [], // Stores suggested topics
        topicDetails: {}, // Stores topic-specific details (e.g., title, category, etc.)
        status: 'idle', // Represents API request status
        error: null, // Stores any errors from API calls
        loading: false, // Indicates loading state
    },
    reducers: {
        setLoading: (state) => {
            state.status = 'loading';
            state.loading = true;
            state.error = null; // Clear previous errors
        },
        setTopicData: (state, action) => {
            const { topicPosts, suggestedTopics, topicDetails } = action.payload;
            state.status = 'succeeded';
            state.loading = false;
            state.suggestedTopics = suggestedTopics || [];
            state.topicPosts = topicPosts || [];
            state.topicDetails = topicDetails || {};
        },
        setError: (state, action) => {
            state.status = 'failed';
            state.loading = false;
            state.error = action.payload;
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter((post) => post.id !== action.payload);
        },
        addPost: (state, action) => {
            state.posts.unshift(action.payload); // Adds a new post to the top of the list
        },
        resetError: (state) => {
            state.error = null;
            state.status = 'idle';
        },
        appendPostOfTopic: (state, action) => {
            state.status = 'succeeded';
            state.loading = false;
            state.topicPosts.push(action.payload);
        },
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export const { setLoading, setTopicData, setError, removePost, addPost, resetError, appendPostOfTopic } = topicsSlice.actions;

// Thunk to fetch specific topic and its posts
export const fetchTopicData = (topicId) => async (dispatch) => {
    try {
        dispatch(setLoading());

        if (!topicId) {
            dispatch(setError(["Topic ID is required"]));
            return;
        }

        const userObj = localStorage.getItem("salla_discourse_user");
        const user = JSON.parse(userObj);
        const username = user?.username || process.env.REACT_APP_API_USERNAME;

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/t/${topicId}/1.json`, {
            headers: {
                'Api-Key': process.env.REACT_APP_API_KEY,
                'Api-Username': username,
                'Content-Type': 'application/json',
            },
        });

        const { post_stream: { posts }, suggested_topics, ...topicDetails } = response.data;

        const updatedSuggestedTopics = suggested_topics.slice(1); // This creates a new array without the first item

        topicDetails.mainPost = posts[0];
        console.log(topicDetails);

        dispatch(setTopicData({
            topicPosts: posts,
            suggestedTopics: updatedSuggestedTopics, // Pass the modified array
            topicDetails,
        }));

    } catch (err) {
        const errorMessage = err.response?.data?.errors || ["An error occurred"];
        dispatch(setError(errorMessage));
    }
};


// export const toggleBookmarkPost = (post, isTopic) => async (dispatch) => {
//     try {
//         dispatch(setLoading());
//         let id = null;
//         if(isTopic){
//             id = 
//         }
//         const formData = new FormData();
//         formData.append("auto_delete_preference", 3);
//         formData.append("bookmarkable_id", post?.id);
//         formData.append("bookmarkable_type", "Post");


//         const userObj = localStorage.getItem("salla_discourse_user");
//         const user = JSON.parse(userObj);
//         let username = process.env.REACT_APP_API_USERNAME;
//         if (user) {
//             username = user.username;
//         }
//         if (post?.bookmarked) {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/bookmarks/`, {
//                 headers: {
//                     'Api-Key': `${process.env.REACT_APP_API_KEY}`,
//                     'Api-Username': username,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const { success, id } = response;

//             if (success) {
//                 dispatch(toggleBookmark());
//             }

//         }
//     } catch (err) {
//         dispatch(setError(errorMessage));
//     }
// }


export default topicsSlice.reducer;
