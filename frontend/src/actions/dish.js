import axios from 'axios';

import {
    DISH_SUCCESS,
    DISH_FAIL, 
    REMOVE_DISH,
    UPDATE_DISH
} from './types';

import { loadUser } from './auth';
import { setAlert } from "./alert";
import { removeLoading } from './loading';

export const addDish = ({DishName,Description,Category,Price,tags,myFile}) => async dispatch =>{
    
    try{
        const config = {
            headers : {
                'Content-Type':'multipart/form-data'
            }
        }
        const formData = new FormData();
        formData.append("DishName",DishName);
        formData.append("Description",Description);
        formData.append("Category",Category);
        formData.append("Price",Price);
        formData.append("tags",tags);
        formData.append("myFile",myFile);

        await axios.post('/api/dishes',formData,config);
        dispatch({
            type : DISH_SUCCESS,
            payload : true
        });
        dispatch(loadUser());
        dispatch(removeLoading());
        dispatch(setAlert(`Dish ${DishName} added Successfully`,'success'));

    }catch(err){
        dispatch({
            type : DISH_FAIL,
        });
        dispatch(removeLoading());
    }
}

export const updateDish = ({DishName,Description,Category,tags,Price,DishID,OldFileName,myFile})=> async dispatch =>{

    try {
        const config = {
            headers : {
                'Content-Type':'multipart/form-data'
            }
        }
        const formData = new FormData();
        formData.append("DishID",DishID);
        formData.append("DishName",DishName);
        formData.append("Description",Description);
        formData.append("Category",Category);
        formData.append("Price",Price);
        formData.append("tags",tags);
        formData.append("OldFileName",OldFileName);
        formData.append("myFile",myFile);

        await axios.post('/api/dishes/update',formData,config);
        
        dispatch({
            type : UPDATE_DISH,
            payload : true
        });
        dispatch(loadUser());
        dispatch(removeLoading());
        dispatch(setAlert(`Dish ${DishName} updated Successfully`,'success'));

    } catch (err) {
        
        dispatch({
            type : DISH_FAIL,
        });
        dispatch(removeLoading());
        dispatch(setAlert('Failed to update Dish','error'));
    }
}

export const deleteDish = ({DeleteCategory,DishID,DishImageName}) => async dispatch => {
    
    const config = {
        headers : {
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({DeleteCategory,DishID,DishImageName});

    try {
        await axios.post('/api/dishes/delete',body,config);
        
        dispatch({
            type : REMOVE_DISH,
            payload : true
        });
        dispatch(loadUser());
        dispatch(removeLoading());
        dispatch(setAlert('Dish Deleted Successfully','success'));

    } catch (err) {
        dispatch({
            type : DISH_FAIL,
        });
        dispatch(removeLoading());
        dispatch(setAlert('Failed to Delete Dish','error'));
    }
}

export const availableDish = ({DishID,Status}) => async dispatch => {
    
    const config = {
        headers : {
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({DishID,Status});

    try {

        await axios.post('/api/dishes/available',body,config);

        dispatch({
            type : UPDATE_DISH,
            payload : true
        });
        
    } catch (err) {
        dispatch({
            type : DISH_FAIL,
        });
    }
};