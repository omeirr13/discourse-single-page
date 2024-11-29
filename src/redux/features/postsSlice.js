import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [
        //     {
        //     id: 1,
        //     name: "Site Feedback 1",
        //     username: "Site Feedback 1",
        //     category_id: 1,
        // },
        // {
        //     id: 2,
        //     name: "Site Feedback 2",
        //     username: "Site Feedback 2",
        //     category_id: 2,
        // },
        ],
        status: 'idle',
        error: null,
    },
    reducers: {
        setLoading: (state) => {
            state.status = 'loading';
        },
        setPosts: (state, action) => {
            state.status = 'succeeded';
            state.posts = action.payload;
        },
        setError: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter((post) => post.id !== action.payload);
        },
    },
});

export const { setLoading, setPosts, setError, removePost } = postsSlice.actions;

export const fetchPosts = () => async (dispatch) => {
    try {
        dispatch(setLoading());
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts.json`);
        console.log("response: ", response);
        const posts = response.data.latest_posts;
        console.log("posts coming...", posts);
        dispatch(setPosts(posts));
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const deletePost = (id) => async (dispatch) => {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/t/${id}.json`);
        dispatch(removePost(id));
    } catch (err) {
        dispatch(setError(err.message));
    }
}

export const createPost = (post) => async(dispatch) => {
    try{
        if(!post || !post.title || !post.category || !post.raw){
            dispatch(setError("Incomplete information"));
            return;
        }
        console.log(post);
        const body = {
            ...post,
            category: post.category.id
        }
        console.log(body);
        await axios.post(`${process.env.REACT_APP_API_URL}/posts.json`, body);
    }
    catch(err){
        dispatch(setError(err.message));
    }
}
export default postsSlice.reducer;
