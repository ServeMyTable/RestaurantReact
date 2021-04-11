import { SET_ATTENDANCE } from './types';

import axios from 'axios';

export const getAttendance = ({EmpID,StartDate,EndDate}) => async dispatch =>{

    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        };
        const body = JSON.stringify({EmpID,StartDate,EndDate});
        const attendance = await axios.post('/api/employee/attendance/employee',body,config);
        dispatch({
            type:SET_ATTENDANCE,
            payload : attendance.data
        });
        
    } catch (error) {
        console.log(error);
    }
};