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
        //     created_at: "2024-11-27T09:54:42.914Z",
        //     cooked: "hello"
        // },
        // {
        //     id: 2,
        //     name: "Site Feedback 2",
        //     username: "Site Feedback 2",
        //     category_id: 2,
        //     created_at:"2023-02-30T09:54:42.914Z"
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
        removeTopic: (state, action) => {
            state.status = 'succeeded';
            console.log("payload: ",action.payload);
            state.posts = state.posts.filter((topic) => topic.id !== action.payload);
        },
        addTopic: (state, action) => {
            state.status = 'succeeded';
            state.posts.unshift(action.payload);  
        },
        resetError: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
});

export const { setLoading, setPosts, setError, removeTopic, addTopic, resetError } = postsSlice.actions;

export const fetchPosts = (method="new") => async (dispatch) => {
    try {
        dispatch(setLoading());
        const userObj = localStorage.getItem("salla_discourse_user");
        const user = JSON.parse(userObj);
        let username = process.env.REACT_APP_API_USERNAME;
        if(user){
            username = user.username;
        }
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/${method}.json?order=views&ascending=false`,{
            headers: {
                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                'Api-Username': username,
                'Content-Type': 'application/json'
            }
        });
        const posts = response.data.topic_list.topics;
        console.log("posts coming...", posts);
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
        if(user){
            username = user.username;
        }

        console.log("url is coming...");
        console.log(`${process.env.REACT_APP_API_URL}/c/${category}/l/${method}.json?order=views&ascending=false`);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/c/${category}/l/${method}.json?order=views&ascending=false`,{
            headers: {
                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                'Api-Username': username,
                'Content-Type': 'application/json'
            }
        });
        const posts = response.data.topic_list.topics;
        console.log("category posts coming...", posts);
        dispatch(setPosts(posts));
    } catch (err) {
        dispatch(setError(err.message));
    }
};

export const deleteTopic = (id) => async (dispatch) => {
    try {
        const userObj = localStorage.getItem("salla_discourse_user");
        const user = JSON.parse(userObj);
        await axios.delete(`${process.env.REACT_APP_API_URL}/t/${id}.json` ,{
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
}

export const createTopic = (post) => async(dispatch) => {
    try{
        
        if(!post || !post.title || !post.category || !post.raw){
            dispatch(setError(["Incomplete information"]));
            return;
        }
        dispatch(setLoading()); // Start loading
        const body = {
            ...post,
            // category: post.category.id
        };

        const userObj = localStorage.getItem("salla_discourse_user");
        const user = JSON.parse(userObj);

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts.json`, body,{
            headers: {
                'Api-Key': `${process.env.REACT_APP_API_KEY}`,
                'Api-Username': user.username,
                'Content-Type': 'application/json'
            }
        });

        dispatch(addTopic(response.data)); 
    }
    catch(err){
        console.log("got error", err);
        dispatch(setError(err.response.data.errors));
    }
}
export default postsSlice.reducer;
