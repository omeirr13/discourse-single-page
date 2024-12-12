import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        status: 'idle',
        error: null,
        loading: false, // New loading state
    },
    reducers: {
        setLoading: (state) => {
            state.status = 'loading';
            state.loading = true; // Set loading to true
        },
        setPosts: (state, action) => {
            state.status = 'succeeded';
            state.loading = false; // Set loading to false
            state.posts = action.payload;
        },
        setError: (state, action) => {
            state.status = 'failed';
            state.loading = false; // Set loading to false
            state.error = action.payload;
        },
        removeTopic: (state, action) => {
            state.status = 'succeeded';
            state.loading = false; // Ensure loading is false
            state.posts = state.posts.filter((topic) => topic.id !== action.payload);
        },
        addTopic: (state, action) => {
            state.status = 'succeeded';
            state.loading = false; // Set loading to false
            state.posts.unshift(action.payload);
        },
        resetError: (state) => {
            state.status = 'idle';
            state.loading = false; // Reset loading to false
            state.error = null;
        },
    },
});

export const { setLoading, setPosts, setError, removeTopic, addTopic, resetError } = postsSlice.actions;

export const fetchPosts = (method = "new") => async (dispatch) => {
    try {
        dispatch(setLoading());
        const userObj = localStorage.getItem("salla_discourse_user");
        const user = JSON.parse(userObj);
        let username = process.env.REACT_APP_API_USERNAME;
        if (user) {
            username = user.username;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/${method}.json?order=views&ascending=false`, {
            headers: {
                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                'Api-Username': username,
                'Content-Type': 'application/json'
            }
        });
        const posts = response.data.topic_list.topics;
        dispatch(setPosts(posts));
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const fetchCategoryPosts = (category, method) => async (dispatch) => {
    try {
        dispatch(setLoading());
        const userObj = localStorage.getItem("salla_discourse_user");
        const user = JSON.parse(userObj);
        let username = process.env.REACT_APP_API_USERNAME;
        if (user) {
            username = user.username;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/c/${category}/l/${method}.json?order=views&ascending=false`, {
            headers: {
                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                'Api-Username': username,
                'Content-Type': 'application/json'
            }
        });
        const posts = response.data.topic_list.topics;
        dispatch(setPosts(posts));
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const deleteTopic = (id) => async (dispatch) => {
    try {
        dispatch(setLoading());
        const userObj = localStorage.getItem("salla_discourse_user");
        const user = JSON.parse(userObj);
        await axios.delete(`${process.env.REACT_APP_API_URL}/t/${id}.json`, {
            headers: {
                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                'Api-Username': user.username,
                'Content-Type': 'application/json'
            }
        });
        dispatch(removeTopic(id));
    } catch (err) {
        dispatch(setError(err.message));
    }
};


export const createTopic = (post) => async (dispatch) => {
    try {
        await dispatch(setLoading());

        if (!post || !post.title || !post.category || !post.raw) {
            await dispatch(setError(["Incomplete information"]));
            return Promise.reject("Incomplete information");
        }

        const body = { ...post };
        const userObj = localStorage.getItem("salla_discourse_user");
        const user = JSON.parse(userObj);

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts.json`, body, {
            headers: {
                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                'Api-Username': user.username,
                'Content-Type': 'application/json'
            }
        });

        await dispatch(addTopic(response.data));
        return response.data;
    } catch (err) {
        dispatch(setError(err.response.data.errors));
        return Promise.reject(err);
    }
};
export default postsSlice.reducer;
