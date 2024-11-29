import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [
            {
            id: 1,
            name: "Site Feedback 1",
            username: "Site Feedback 1",
            category_id: 1,
            created_at: "2024-11-27T09:54:42.914Z",
            cooked: "hello"
        },
        {
            id: 2,
            name: "Site Feedback 2",
            username: "Site Feedback 2",
            category_id: 2,
            created_at:"2023-02-30T09:54:42.914Z"
        },
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
        addPost: (state, action) => {
            state.posts.push(action.payload);  
        },
    },
});

export const { setLoading, setPosts, setError, removePost } = postsSlice.actions;

export const fetchPosts = () => async (dispatch) => {
    try {
        dispatch(setLoading());
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts.json`,{
            headers: {
                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                'Api-Username': `${process.env.REACT_APP_API_USERNAME}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("response: ", response);
        const posts = response.data.latest_posts;
        console.log("posts coming...", posts);
        dispatch(setPosts(posts));
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const deleteTopic = (id) => async (dispatch) => {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/t/${id}.json` ,{
            headers: {
                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                'Api-Username': `${process.env.REACT_APP_API_USERNAME}`,
                'Content-Type': 'application/json'
            }
        });
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
        const body = {
            ...post,
            category: post.category.id
        };

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts.json`, body);

        dispatch(addPost(response.data)); 
    }
    catch(err){
        dispatch(setError(err.message));
    }
}
export default postsSlice.reducer;
