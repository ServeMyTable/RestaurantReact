import {SET_LOADING_TRUE,SET_LOADING_FALSE} from './types';

export const setLoading = () => dispatch =>{
    dispatch({
        type:SET_LOADING_TRUE,
        payload:true
    });
};

export const removeLoading = () => dispatch =>{
    dispatch({
        type:SET_LOADING_FALSE,
        payload:false
    });
};