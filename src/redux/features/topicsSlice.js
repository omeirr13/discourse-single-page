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
        toggleBookmark: (state, action) => {
            state.status = 'succeeded';
            state.loading = false;
            const { isTopic, postId, bookmarked, bookmark_id } = action.payload;
            if (isTopic) {
                console.log("isTOpic");
                state.topicDetails = {
                    ...state.topicDetails,
                    bookmarked,
                    ...(bookmarked && { bookmark_id })
                }
            }
            else {
                state.topicPosts = state.topicPosts.map((post) => {
                    return (post?.id == postId) ? {
                        ...post,
                        bookmarked,
                         ...(bookmarked && { bookmark_id })
                    } :
                        post
                });
            }
        },
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export const { setLoading, setTopicData, setError, removePost, addPost, resetError, appendPostOfTopic, toggleBookmark } = topicsSlice.actions;

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

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/t/${topicId}/1.json?track_visit=true&forceLoad=true`, {
            headers: {
                'Api-Key': process.env.REACT_APP_API_KEY,
                'Api-Username': username,
                'Content-Type': 'application/json',
            },
        });

        const { post_stream: { posts }, suggested_topics = [], ...topicDetails } = response.data;

        const updatedSuggestedTopics = suggested_topics.slice(1); // This creates a new array without the first item

        topicDetails.mainPost = posts[0];
        console.log(topicDetails);

        dispatch(setTopicData({
            topicPosts: posts.slice(1),
            suggestedTopics: updatedSuggestedTopics, // Pass the modified array
            topicDetails,
        }));

    } catch (err) {
        console.log(err);
        const errorMessage = err.response?.data?.errors || ["An error occurred"];
        dispatch(setError(errorMessage));
    }
};


export const toggleBookmarkPost = (post, isTopic) => async (dispatch) => {
    try {
        const userObj = localStorage.getItem("salla_discourse_user");
        const user = JSON.parse(userObj);
        const username = user?.username || process.env.REACT_APP_API_USERNAME;

        
        if (!post?.bookmarked) {//not bookmarked previously
            const formData = new FormData();
            formData.append("auto_delete_preference", 3);
            formData.append("bookmarkable_id", post?.id);
            formData.append("bookmarkable_type", "Post");
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/bookmarks/`, formData, {
                headers: {
                    'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                    'Api-Username': username,
                }
            });
            const { success, id } = response.data;

            if (success) {
                let postId = post?.id;
                dispatch(toggleBookmark({ isTopic, postId, bookmarked: true, bookmark_id: id }));
            }
        }
        else {
            let bookmark_id = post?.bookmark_id;
            let postId = post?.id;
            const body = { id: postId };

            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/bookmarks/${bookmark_id}.json`, {
                headers: {
                    'Api-Key': process.env.REACT_APP_API_KEY,
                    'Api-Username': username,
                    'Content-Type': 'application/json',
                },
            });
            const { success } = response.data;
            if (success) {
                dispatch(toggleBookmark({ isTopic, postId, bookmarked: false }))
            }
        }
    } catch (err) {
        console.log(err);
        dispatch(setError(err));
    }
}


export default topicsSlice.reducer;
