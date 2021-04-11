import {
    
    ADD_EMPLOYEE_SUCCESS,
    ADD_EMPLOYEE_FAIL,
    SET_EMPLOYEE_SUCCESS,
    SET_EMPLOYEE_FAIL,
    DELETE_EMPLOYEE_SUCCESS,
    DELETE_EMPLOYEE_FAIL,

} from './types';

import { setAlert } from './alert';
import axios from 'axios';
import { removeLoading } from './loading';

export const saveEmployee = ({EmployeeName,EmployeeAddress,EmployeePost,EmployeeSalary,
    EmployeePhone,EmployeeDOB,EmployeeAadhar,EmployeePan,EmployeeProfilePic,
    EmployeeAadharPic,EmployeePanPic}) => async dispatch =>{

    try {
        const config = {
            headers : {
                'Content-Type':'multipart/form-data'
            }
        }
        const formData = new FormData();
        formData.append("EmployeeProfilePic",EmployeeProfilePic);
        formData.append("EmployeeAadharPic",EmployeeAadharPic);
        formData.append("EmployeePanPic",EmployeePanPic);
        formData.append("EmployeeName",EmployeeName);
        formData.append("EmployeeAddress",EmployeeAddress);
        formData.append("EmployeePost",EmployeePost);
        formData.append("EmployeeSalary",EmployeeSalary);
        formData.append("EmployeePhone",EmployeePhone);
        formData.append("EmployeeDOB",EmployeeDOB);
        formData.append("EmployeeAadhar",EmployeeAadhar);
        formData.append("EmployeePan",EmployeePan);
        
        const resp = await axios.post("/api/employee/",formData,config);
        dispatch({
            type : ADD_EMPLOYEE_SUCCESS,
            payload : resp.data
        });
        dispatch(removeLoading());
        dispatch(getEmployees());
        dispatch(setAlert("Employee Added Successfully","success"));

    } catch (error) {
        dispatch({
            type : ADD_EMPLOYEE_FAIL
        });
        dispatch(removeLoading());
        dispatch(setAlert("Unable to add Employee","error"));
    }

};

export const getEmployees = () => async dispatch =>{

    try{
        const response = await axios.get("/api/employee/");
        dispatch({
            type : SET_EMPLOYEE_SUCCESS,
            payload : response.data
        });

    }catch(err){
        console.log(err);
        dispatch({
            type : SET_EMPLOYEE_FAIL,
        });
    }

};

export const deleteEmployee = ({EmpID,ImageFileName,AadharFileName,PanFileName}) => async dispatch =>{

    try {
        
        const response = await axios.post("/api/employee/delete",
        {EmpId:EmpID,ImageFileName,AadharFileName,PanFileName},
        {headers:{
            "Content-Type" : "application/json"
        }
        });
        dispatch({
            type:DELETE_EMPLOYEE_SUCCESS,
            payload:response.data
        });
        dispatch(getEmployees());
        dispatch(removeLoading());

    } catch (err) {
        console.log(err);
        dispatch({
            type:DELETE_EMPLOYEE_FAIL
        });
    }   dispatch(removeLoading());
};

export const saveAttendance = ({data}) => async dispatch =>{

    try{
        const config = {
            headers:{
                "Content-Type" : "application/json"
            }
        };
        const body = JSON.stringify({data:data});
        const response = await axios.post("/api/employee/attendance",body,config);
        dispatch(removeLoading());
        if(response.data === 'ok'){
            dispatch(setAlert('Attendance saved successfully','success'));
        }

    }catch(error){
        //console.log(error);
        dispatch(removeLoading());
        dispatch(setAlert('Attendance was not saved','error'));
        
    }
};