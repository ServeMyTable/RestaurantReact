import { SET_MENUTYPE } from './types';

export const setMenu = (text) => dispatch => {
    dispatch({
        type : SET_MENUTYPE,
        payload : text
    });
};