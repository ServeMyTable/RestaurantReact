import React from 'react';

import AddIcon from '@material-ui/icons/Add';

import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { 
    Box, Button, Grid, Avatar, Divider, TextField, Typography, 
    Dialog, DialogTitle, DialogContent, DialogActions, 
} from '@material-ui/core';

import Alerts from './Alerts';
import { saveEmployee, getEmployees, deleteEmployee, saveAttendance} from '../../actions/employees';
import { getAttendance } from '../../actions/attendance';
import { connect } from 'react-redux';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DeleteIcon from '@material-ui/icons/Delete';
import { useMediaQuery } from 'react-responsive';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';

import Loading from '../components/Loading';
import { setLoading } from '../../actions/loading';

import { Pagination, Search } from "./DataTable";
import axios from 'axios';

const useStyles = makeStyles((theme)=>({

    customInput : {
        marginTop:10,
        marginBottom:10,
        width:theme.spacing(40),
    },
    customFileInput : {
        marginTop:10,
        marginBottom:10,
        width:theme.spacing(40),
        border : "1px solid rgba(0,0,0,0.20)",
        padding : 12,
        borderRadius : 5
    },
    customMobileFileInput:{
        marginTop:10,
        marginBottom:10,
        width:"100%",
        border : "1px solid rgba(0,0,0,0.20)",
        padding : 12,
        borderRadius : 5,
    },
    customText:{
        marginTop:10,
        marginBottom:10,
        width:theme.spacing(40),
        padding : 12,
    },
    alignCenter:{
        display:'flex',justifyContent:'center',alignContent:'center'
    },
    mtb10:{
        marginTop:10,marginBottom:10
    },
    mBox: {
        padding: 20,
        marginTop: 10,
        boxShadow:"0px 3px 6px rgba(0,0,0,16%)"
    },
    present:{ backgroundColor:"#28a745",color:'#FFF' },
    absent :{ backgroundColor:"#d63447",color:'#FFF' },
    Box1 : {
        padding:10,
        backgroundColor:"#28a7458F",
        textAlign:"left",
        marginTop:10,
        marginBottom:10,
        border:'4px solid #28a745',
        borderRadius:5,
        marginRight:10
    },
    Box2:{
        padding:10,
        backgroundColor:"#d634478F",
        textAlign:"left",
        marginTop:10,
        marginBottom:10,
        border:'4px solid #d63447',
        borderRadius:5,
        marginLeft:10,
        marginRight:10
    },
    Box3:{
        padding:10,
        backgroundColor:"#FFD31D8F",
        textAlign:"left",
        marginTop:10,
        marginBottom:10,
        border:'4px solid #FFD31D',
        borderRadius:5,
        marginLeft:10,
    }

}));

function Employees(props) {

    const classes = useStyles();

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    const [openAddEmployee,setOpenEmployee] = React.useState(false);
    const [openAttendance,setOpenAttendance] = React.useState(false);
    const [openEmployeeDetails,setOpenDetails] = React.useState(false);
    const [singleEmpData,setEmpData] = React.useState(null);
    const [showTable,setShowTable] = React.useState(false);

    const [date, setDates] = React.useState({
        StartDate:null,
        EndDate:null
    });

    const [EmpDetails,setDetails] = React.useState({
        EmployeeName : '',
        EmployeeAddress : '',
        EmployeePost : '',
        EmployeeSalary : null,
        EmployeePhone : null,
        EmployeeDOB : null,
        EmployeeAadhar : null,
        EmployeePan : null
    });

    const [EmpDocuments,setEmpDocuments] = React.useState({
        EmployeeProfilePic : null,
        EmployeeAadharPic : null,
        EmployeePanPic : null
    });

    const [ProfilePic,setProfilePic] = React.useState(null);
    
    const handleOpenAttendanceDialog = () =>{ setOpenAttendance(true); };
    const handleCloseAttendanceDialog = () =>{ setOpenAttendance(false); };
    const handleCloseDialog = () =>{setOpenEmployee(false)};
    const handleOpenDialog = () =>{setOpenEmployee(true)};
    const handleChange = (e) =>{
        setDetails({...EmpDetails,[e.target.name]:e.target.value});
    };

    const handleChangeDocuments = (e) =>{
        setEmpDocuments({...EmpDocuments,[e.target.name]:e.target.files[0]});
        if(e.target.name === "EmployeeProfilePic"){
            setProfilePic(URL.createObjectURL(e.target.files[0]));
        }
    };
    
    React.useEffect(()=>{ props.getEmployees(); },[]);
    
    
    function handleFormSubmit(e){
        e.preventDefault();
        props.saveEmployee({
            EmployeeName : EmpDetails.EmployeeName,
            EmployeeAddress: EmpDetails.EmployeeAddress,
            EmployeePost : EmpDetails.EmployeePost,
            EmployeeSalary : EmpDetails.EmployeeSalary,
            EmployeePhone : EmpDetails.EmployeePhone,
            EmployeeDOB : EmpDetails.EmployeeDOB,
            EmployeeAadhar : EmpDetails.EmployeeAadhar,
            EmployeePan : EmpDetails.EmployeePan,
            EmployeeProfilePic : EmpDocuments.EmployeeProfilePic,
            EmployeeAadharPic : EmpDocuments.EmployeeAadharPic,
            EmployeePanPic : EmpDocuments.EmployeePanPic
        });
        props.setLoading();
    }

    function EmployeeView({employee}){

        const downloadFile = (fileUrl) =>{

            const newWindow = window.open(fileUrl, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
            newWindow.document.write("<p>Downloading in progress</p>");
            newWindow.location = fileUrl;
        };

        const DeleteEmployee = (EmpID,ImageFileName,AadharFileName,PanFileName) =>{
            props.deleteEmployee({EmpID,ImageFileName,AadharFileName,PanFileName});
            props.setLoading();
            setOpenDetails(false);
        };

        

        const handleCloseView = () =>{ setOpenDetails(false) };

        function AttendanceTable(){

            const [totalItems, setTotalItems] = React.useState(0);
            const [currentPage,setCurrentPage] = React.useState(1);
            const ITEMS_PER_PAGE = 5;

            const attendanceData = React.useMemo(() => {
                let computedAttendance = props.attendance;
                let paging = [];
                if(computedAttendance !== null && computedAttendance.length > 0){
                    setTotalItems(computedAttendance.length);
                    paging = computedAttendance.slice(
                        (currentPage - 1) * ITEMS_PER_PAGE,
                        (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
                    );
                }else{
                    setTotalItems(0);
                }

                //Current Page slice
                return paging;
            }, [currentPage]);

            function getTotalPresent(){
                var counter = 0;
                if(props.attendance !== null){
                    let nAttendance = props.attendance;
                    for(var i = 0 ; i < nAttendance.length ; i++)
                    {
                        if(nAttendance[i].Status === 'PRESENT'){
                            counter+=1;
                        }
                    }
                }
                return counter;
            }
            
            function getTotalAbsent(){
                var counter = 0;
                if(props.attendance !== null){
                    let nAttendance = props.attendance;
                    for(var i = 0 ; i < nAttendance.length ; i++)
                    {
                        if(nAttendance[i].Status === 'ABSENT'){
                            counter+=1;
                        }
                    }
                }
                return counter;
            }

            function getTotalDays(){
                
                const sDay = (new Date(date.StartDate)).getTime();
                const eDay = (new Date(date.EndDate)).getTime();
                const diffDay = Math.abs(sDay - eDay);
                return Math.ceil((diffDay / (1000 * 60 * 60 * 24))+1); 
            }

            return(
            <Box>
                <Box display='flex' flexDirection='row' justifyContent='center' alignContent='center'>
                    <Box className={classes.Box1}>
                        <Typography className='mFont'>Total Days Present</Typography>
                        <Typography className='mFont'>{getTotalPresent()}</Typography>
                    </Box>
                    <Box className={classes.Box2}>
                        <Typography className='mFont'>Total Days Absent</Typography>
                        <Typography className='mFont'>{getTotalAbsent()}</Typography>
                    </Box>
                    <Box className={classes.Box3}>
                        <Typography className='mFont'>Total Days</Typography>
                        <Typography className='mFont'>{getTotalDays()}</Typography>
                    </Box>
                </Box>
                <table className='table table-stripped'>
                    <thead style={{backgroundColor:"#FFD31D"}}>
                        <tr>
                            <th className='mFont text-center'>Date</th>
                            <th className='mFont text-center'>In Time</th>
                            <th className='mFont text-center'>Out Time</th>
                            <th className='mFont text-center'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map(attendance=>(
                            <tr>
                                <td className='mFont text-center'>{attendance.date}</td>
                                <td className='mFont text-center'>{attendance.inTime}</td>
                                <td className='mFont text-center'>{attendance.outTime}</td>
                                <td>
                                    <Box className={classes.alignCenter}>
                                    <Box 
                                    className={ attendance.Status=== 'PRESENT' ? 
                                                classes.present : 
                                                classes.absent }
                                    style={{padding:10}}>
                                        {attendance.Status}
                                    </Box>
                                    </Box>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    total={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={page => setCurrentPage(page)}
                />
            </Box>
            );
        }

        
        function EmployeeDetails(){
            
            const [StartDate,setStartDate] = React.useState(null);
            const [EndDate,setEndDate] = React.useState(null);
    
            function handleGetAttendance(e){
                e.preventDefault();
                props.getAttendance({EmpID:employee._id,StartDate,EndDate});
                setDates({StartDate:StartDate,EndDate:EndDate});
                setShowTable(true);
            }
            return(
                <Box>
                    <Typography style={{letterSpacing:2,marginTop:10}}>BASIC DETAILS</Typography>

                    <Box className={classes.mBox}>
                        <Box display='flex' flexDirection='row' justifyContent='space-between'>
                            <Typography>Employee Id</Typography>
                            <Typography>{employee._id}</Typography>
                        </Box>
                        <Box style={{marginTop:10}} display='flex' flexDirection='row' justifyContent='space-between'>
                            <Typography>Post</Typography>
                            <Typography>{employee.EmpPost}</Typography>
                        </Box>
                        <Box style={{marginTop:10}} display='flex' flexDirection='row' justifyContent='space-between'>
                            <Typography>Salary</Typography>
                            <Typography>{employee.Salary}</Typography>
                        </Box>
                        <Box style={{marginTop:10}} display='flex' flexDirection='row' justifyContent='space-between'>
                            <Typography>Date Of Birth</Typography>
                            <Typography>{employee.DOB}</Typography>
                        </Box>
                    </Box>
                    <Typography style={{letterSpacing:2,marginTop:10}}>DOCUMENT DETAILS</Typography>
                    <Box className={classes.mBox}>
                        <Box display='flex' flexDirection='row' justifyContent='space-between'>
                            <Typography>Aadhar Number</Typography>
                            <Typography onClick={()=>{downloadFile(employee.AadharFileUrl)}} style={{cursor:'pointer',color:'#0645AD',textDecoration:'underlined'}} >{employee.AadharNo}</Typography>
                        </Box>
                        <Box style={{marginTop:10}} display='flex' flexDirection='row' justifyContent='space-between'>
                            <Typography>Pan Number</Typography>
                            <Typography onClick={()=>{downloadFile(employee.PanFileUrl)}} style={{cursor:'pointer',color:'#0645AD',textDecoration:'underlined'}} >{employee.PanNo}</Typography>
                        </Box>
                    </Box>
                    <Typography style={{letterSpacing:2,marginTop:10}}>ATTENDANCE DETAILS</Typography>
                    <Box className={classes.mBox}>
                        <Box>
                            <form onSubmit={(e)=>handleGetAttendance(e)}>
                            <TextField
                                variant='outlined'
                                type='date'
                                label='Start Date'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    style:{height:10}
                                }}
                                value={StartDate}
                                onChange={(e)=>{setStartDate(e.target.value)}}
                                required
                            />
                            <TextField
                                variant='outlined'
                                type='date'
                                label='End Date'
                                style={{marginLeft:10}}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    style:{height:10}
                                }}
                                value={EndDate}
                                onChange={(e)=>{setEndDate(e.target.value)}}
                                required
                            />
                            <Button type='submit' style={{marginLeft:10,padding:10,paddingLeft:20,paddingRight:20}} color='primary' variant='outlined'>Submit</Button>
                            </form>
                        </Box>
                        { showTable && <AttendanceTable/>}
                    </Box>
                </Box>
            );
        }



        if(isMobile || isMobileDevice ){
            return(
                <Box style={{marginLeft:20,marginTop:20,marginRight:20}}>
                    <Box display="flex" flexDirection="row">
                        <Button startIcon={<ArrowBackIosIcon/>} onClick={handleCloseView} style={{background:'#ffe98d',width:'100px'}}>B A C K</Button>
                    </Box>
                    <Grid container style={{marginTop:10}}>
                        <Grid item sm={6} xs={6}>
                            <Avatar variant="rounded" src={employee.ImageFileUrl} alt="Profile Pic" style={{width:200,height:200,border:"1px solid #000"}}/>
                        </Grid>
                        <Grid item sm={6} xs={6}>
                            <Typography variant="h6">{employee.Name}</Typography>
                            <Typography variant="h6" color="textSecondary">{employee.EmpPost}</Typography>
                            <Typography variant="h6" color="textSecondary">{employee.Phone}</Typography>
                            <Typography variant="h6" color="textSecondary">{employee.Address}</Typography>
                        </Grid>
                    </Grid>
                    <EmployeeDetails/>
                
                    <Box>
                        <Button onClick={()=>{
                            DeleteEmployee(
                                employee._id,
                                employee.ImageFileName,
                                employee.AadharFileName,
                                employee.PanFileName
                                )
                            }} 
                            style={{marginTop:10}} 
                            startIcon={<DeleteIcon/>} 
                            variant="contained" 
                            color="secondary"
                            fullWidth
                            >Delete Employee</Button>
                    </Box>
                </Box>
            );
        }

        return(
            <Box style={{marginLeft:20,marginTop:20}}>
                <Box display="flex" flexDirection="row">
                    <Button startIcon={<ArrowBackIosIcon/>} onClick={handleCloseView} style={{background:'#ffe98d',width:'100px'}}>B A C K</Button>
                </Box>               
                <Grid container style={{marginTop:10}}>
                    <Grid item sm={3} xs={3}>
                        <Avatar variant="rounded" src={employee.ImageFileUrl} alt="Profile Pic" style={{width:200,height:200,border:"1px solid #000"}}/>
                    </Grid>
                    <Grid item sm={9} xs={9}>
                        <Typography variant="h6">{employee.Name}</Typography>
                        <Typography variant="h6" color="textSecondary">{employee.EmpPost}</Typography>
                        <Typography variant="h6" color="textSecondary">{employee.Phone}</Typography>
                        <Typography variant="h6" color="textSecondary">{employee.Address}</Typography>
                    </Grid>
                </Grid>                
                <EmployeeDetails/>
                <Box>
                    <Button onClick={()=>{
                        DeleteEmployee(employee._id,employee.ImageFileName,employee.AadharFileName,employee.PanFileName)
                        }} style={{marginTop:10}} startIcon={<DeleteIcon/>} variant="contained" color="secondary">Delete Employee</Button>
                </Box>

            </Box>
        );
    }

    function EmployeeTable(){
    
        const [search, setSearch] = React.useState("");
        const [totalItems, setTotalItems] = React.useState(0);
        const [currentPage,setCurrentPage] = React.useState(1);
        
        const ITEMS_PER_PAGE = 10;

        const employeeData = React.useMemo(() => {
            let computedEmployees = props.employees;
    
            if (search) {
                computedEmployees = computedEmployees.filter(
                    emp =>
                        emp.Name.toLowerCase().includes(search.toLowerCase()) ||
                        emp.Phone.toLowerCase().includes(search.toLowerCase())
                );
            }
    
            setTotalItems(computedEmployees.length);
    
            //Current Page slice
            return computedEmployees.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
            );
        }, [currentPage, search]);

        if(props.employees.length>0){
            return(
                <Box>
                <div style={{marginTop:10,marginBottom:10}}>
                    <Search
                        onSearch={value => {
                            setSearch(value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="row w-100">
                    <div className="col mb-3 col-12 text-center">
                        <table className="table table-striped">
                            <thead style={{backgroundColor:'#FFD31D'}}>
                                <tr>
                                    <th className='mFont'>#</th>
                                    <th className='mFont'>Name</th>
                                    <th className='mFont'>Post</th>
                                    <th className='mFont'>Phone</th>
                                    <th className='mFont'>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeData.map((emp,index) => (
                                    <tr>
                                        <th scope="row" key={emp.id} className='mFont'>
                                            {index+1}
                                        </th>
                                        <td className='mFont'
                                        style={{cursor:'pointer',color:'#0645AD'}} 
                                        onClick={
                                            ()=>{
                                                setEmpData(emp);
                                                setOpenDetails(true);
                                            }
                                        }>{emp.Name}</td>
                                        <td className='mFont'>{emp.EmpPost}</td>
                                        <td className='mFont'>{emp.Phone}</td>
                                        <td className='mFont'>{emp.Address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <Pagination
                        total={totalItems}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
                </Box>
            );
        }
        else{
            return(<Box></Box>);
        }
    }

    function AttendanceDialog(){

        const [selected,setSelected] = React.useState({});
        const [inTime,setInTime] = React.useState({});
        const [outTime,setOutTime] = React.useState({});

        async function checkAttendance(){

            try{
                const config = {
                    headers:{
                        "Content-Type" : "application/json"
                    }
                };
                const response = await axios.get('/api/employee/checkAttendance',config);
                return response.data;
        
            }catch(error){
                //console.log(error);
                //return false;
            }
        };

        const handleChangeInTime = (value,empID) =>{
            setInTime({...inTime,[empID]:value});
        };

        const handleChangeOutTime = (value,empID) =>{
            setOutTime({...outTime,[empID]:value});
        };

        const handleSubmitData = () =>{

            const mdata = [];
            let today = new Date().toISOString().slice(0, 10);
            for(var i = 0 ; i < props.employees.length ; i++){
                var temp = {
                    Status : null,
                    inTime : null,
                    outTime : null,
                };

                var singleEmployeeID = (props.employees[i]._id).toString();

                if(selected[singleEmployeeID] === 'PRESENT'){
                    temp.Status = 'PRESENT';
                }else{
                    temp.Status = 'ABSENT';
                }
                if(inTime[singleEmployeeID]){
                    temp.inTime = inTime[singleEmployeeID];
                }
                if(outTime[singleEmployeeID]){
                    temp.outTime = outTime[singleEmployeeID];
                }

                mdata.push({
                    id : singleEmployeeID,
                    ...temp    
                })
            }
            props.saveAttendance({data : {date : today,data : mdata}});
            props.setLoading();
            handleCloseAttendanceDialog();
        };
        const [resp,setResp] = React.useState(false);
        checkAttendance().then((data)=>{
            setResp(data);
        });
        if(resp){

            return(
                <Dialog open={openAttendance} onClose={handleCloseAttendanceDialog}>
                <DialogTitle>Attendance</DialogTitle>
                <DialogContent>
                <Box style={{marginTop:20,marginBottom:20}}>
                    <Typography className='mFont' style={{textAlign:'center'}}>Attendance have been submitted successfully</Typography>
                </Box>
                </DialogContent>
                </Dialog>
            
            )
        }
        else{
        return(
            <Dialog open={openAttendance} onClose={handleCloseAttendanceDialog} fullWidth maxWidth="lg">
                <DialogTitle>Attendance</DialogTitle>
                <DialogContent>
                    <table className='table'>
                        <thead style={{backgroundColor:'#FFD31D'}}>
                            <tr>
                                <th className='mFont text-center'>#</th>
                                <th className='mFont text-center'>Name</th>
                                <th className='mFont text-center'>In Time</th>
                                <th className='mFont text-center'>Out Time</th>
                                <th className='mFont text-center'>Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.employees.length > 0 &&
                                props.employees.map((emp,index)=>(
                                    <tr>
                                        <td className='mFont text-center'>{index+1}</td>
                                        <td className='mFont text-center'>{emp.Name}</td>
                                        <td>
                                            <Box className={classes.alignCenter}>
                                                <TextField
                                                    variant='outlined'
                                                    type='time'
                                                    color='primary'
                                                    placeholder='In Time'
                                                    onChange={(e)=>{handleChangeInTime(e.target.value,emp._id)}}
                                                    inputProps={{style:{height:10,width:150}}}
                                                />
                                            </Box>
                                        </td>
                                        <td>
                                            <Box className={classes.alignCenter}>
                                                <TextField
                                                    variant='outlined'
                                                    type='time'
                                                    color='primary'
                                                    placeholder='Out Time'
                                                    onChange={(e)=>{handleChangeOutTime(e.target.value,emp._id)}}
                                                    inputProps={{style:{height:10,width:150}}}
                                                />
                                            </Box>
                                        </td>
                                        <td>
                                            <Box className={classes.alignCenter}>
                                                <Button 
                                                className={ selected[emp._id]=== 'PRESENT' ? classes.present : classes.absent}
                                                onClick={()=>{
                                                    selected[emp._id] === 'PRESENT'?
                                                    setSelected({...selected,[emp._id]:'ABSENT'})
                                                :
                                                    setSelected({...selected,[emp._id]:'PRESENT'});
                                                }}
                                                >
                                                    {selected[emp._id]=== 'PRESENT' ? 'PRESENT' : 'ABSENT'}
                                                </Button>
                                            </Box>
                                        </td>
                                    </tr>
                                ))
                            }
                            
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" style={{color:"black"}} onClick={handleCloseAttendanceDialog}>Close</Button>
                    <Button variant="contained" color="primary" style={{marginLeft:10}} onClick={handleSubmitData}>SAVE</Button>
                </DialogActions>
            </Dialog>
        );
        }
    }

    if(openEmployeeDetails){
        return <EmployeeView employee={singleEmpData}/>
    }
    else if(props.loading){
        return <Loading/>
    }
    else if(isMobile || isMobileDevice){
        return(
            <Box>
                <Box>
                <Grid container style={{marginLeft:10,marginRight:10}}>
                    <Grid item sm={5} xs={5}>
                        <h3 className="mFont">Employees</h3>
                    </Grid>
                    <Grid item sm={7} xs={7}>
                        <Box textAlign="right">
                        <Button 
                            className="mFont"
                            color="secondary"
                            variant="contained" 
                            style={{marginRight:10}}
                            onClick={handleOpenAttendanceDialog}
                            disableElevation
                        >Take Attendance</Button>
                        <Button 
                            className="mFont"
                            startIcon={<AddIcon/>}
                            color="primary"
                            variant="contained" 
                            style={{marginRight:20}}
                            onClick={handleOpenDialog}
                            disableElevation
                        >Add Employees</Button>
                        </Box>
                    </Grid>
                </Grid>
                {props.employees.length <= 0 ?
                    <Box style={{width:"100%",marginTop:40}}>
                        <Typography style={{textAlign:"center"}}><PersonAddDisabledIcon/></Typography>
                        <Typography style={{textAlign:"center"}}>No Employees Added yet.</Typography>
                    </Box>
                    :
                    <EmployeeTable/>
                }
                </Box>
                
                <AttendanceDialog/>

                <Dialog open={openAddEmployee} onClose={handleCloseDialog} fullWidth maxWidth="lg">
                <DialogTitle className='mFont'>Add Employee</DialogTitle>
                <Divider/>
                <form onSubmit={(e)=>handleFormSubmit(e)} encType="multipart/form-data">
                    <DialogContent>
                        {props.alert.length > 0 && <Alerts/>}
                        <Typography style={{letterSpacing:2,textAlign:'center',marginTop:10,marginBottom:10}} variant="h6">BASIC INFORMATION</Typography>
                        <Box>
                            <Box className={classes.alignCenter}>
                            {ProfilePic === null ? 
                                <Box style={{width:200,height:200,border:"1px solid black"}}></Box>
                                :
                                <img src={ProfilePic} width="200px" height="200px" alt="unable to display." style={{border:"1px solid black"}}/>
                            }
                            </Box>
                            <Box>
                                <Typography variant="h6" style={{textAlign:'center',marginTop:10,marginBottom:10}}>Upload Employee Photo</Typography>
                                <Box className={classes.alignCenter}>
                                    <input
                                        name="EmployeeProfilePic"
                                        variant="outlined"
                                        onChange={handleChangeDocuments}
                                        className={classes.customFileInput}
                                        type="file"
                                        accept="image/*"
                                        required
                                    />
                                </Box>
                                <Box className={classes.alignCenter}>
                                    <TextField
                                        name="EmployeeName"
                                        variant="outlined"
                                        className={classes.customInput}
                                        type="text"
                                        placeholder="Employee Name"
                                        label="Employee Name"
                                        onChange={handleChange}
                                        required
                                    />
                                </Box>
                                <Box className={classes.alignCenter}>
                                    <TextField
                                        name="EmployeeAddress"
                                        variant="outlined"
                                        className={classes.customInput}
                                        type="text"
                                        onChange={handleChange}
                                        placeholder="Employee Address"
                                        label="Employee Address"
                                        required
                                    />
                                </Box>
                                <Box className={classes.alignCenter}>
                                    <TextField
                                        name="EmployeeDOB"
                                        variant="outlined"
                                        className={classes.customInput}  
                                        type="date"
                                        onChange={handleChange}
                                        label="Date of Birth"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                </Box>
                                <Box className={classes.alignCenter}>
                                    <TextField
                                        name="EmployeePhone"
                                        variant="outlined"
                                        className={classes.customInput}
                                        type="number"
                                        onChange={handleChange}
                                        placeholder="Employee Phone"
                                        label="Employee Phone"
                                        required
                                    />
                                </Box>  
                                <Box className={classes.alignCenter}>
                                    <Autocomplete
                                        name="EmployeePost"
                                        onInputChange={(e,newInputValue)=>{
                                            setDetails({...EmpDetails,"EmployeePost":newInputValue});
                                        }}
                                        className={classes.customInput}
                                        options={['Owner','Manager','Waiter','Chef','Cleaner','Co-worker','Helper']}
                                        renderInput={(params)=>
                                            
                                            <TextField
                                                {...params}
                                                variant="outlined" 
                                                placeholder="Employee Post"
                                                label="Employee Post"
                                                required
                                            />
                                        }
                                    />
                                </Box>
                                <Box className={classes.alignCenter}>
                                    <TextField
                                        name="EmployeeSalary"
                                        variant="outlined"
                                        className={classes.customInput}
                                        type="number"
                                        onChange={handleChange}
                                        placeholder="Employee Salary"
                                        label="Employee Salary"
                                        required
                                    />
                                </Box>

                                <Typography style={{letterSpacing:2,marginTop:10,marginBottom:10,textAlign:'center'}} variant="h6">DOCUMENT INFORMATION</Typography>
                                <Typography variant="h6" style={{textAlign:'center',marginTop:10,marginBottom:10}}>Aadhar Details</Typography>

                                <Box className={classes.alignCenter}>
                                    <input
                                        name="EmployeeAadharPic"
                                        variant="outlined"
                                        onChange={handleChangeDocuments}
                                        className={classes.customFileInput}
                                        type="file"
                                        required
                                    />
                                </Box>
                                <Box className={classes.alignCenter}>
                                    <TextField
                                        name="EmployeeAadhar"
                                        variant="outlined"
                                        className={classes.customInput}
                                        type="number"
                                        onChange={handleChange}
                                        placeholder="Employee Aadhar Number"
                                        label="Employee Aadhar Number"
                                        required
                                    />
                                </Box>
                                
                                <Typography variant="h6" style={{textAlign:'center',marginTop:10,marginBottom:10}}>Pan Details</Typography>
                                
                                <Box className={classes.alignCenter}>
                                    <input
                                        name="EmployeePanPic"
                                        variant="outlined"
                                        onChange={handleChangeDocuments}
                                        className={classes.customFileInput}
                                        type="file"
                                        required
                                    />
                                </Box>
                                <Box className={classes.alignCenter}>
                                    <TextField
                                        name="EmployeePan"
                                        variant="outlined"
                                        className={classes.customInput}
                                        type="text"
                                        onChange={handleChange}
                                        placeholder="Employee Pan Number"
                                        label="Employee Pan Number"
                                        required
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>
                    <Divider/>
                    <DialogActions>
                        <Button variant="contained" style={{color:"black"}} onClick={handleCloseDialog}>CANCEL</Button>
                        <Button type="submit" variant="contained" color="primary" style={{marginLeft:10}}>SAVE</Button>
                    </DialogActions>
                </form>
            </Dialog>

            </Box>
        );
    }
    else{
    return (
        <Box>
            <Box>
            <Grid container>
                <Grid item sm={3} xs={3}>
                    <h3 className="mFont">Employees</h3>
                </Grid>
                <Grid item sm={9} xs={9}>
                    <Box textAlign="right">
                        <Button 
                            className="mFont"
                            color="secondary"
                            variant="contained" 
                            style={{marginRight:10}}
                            onClick={handleOpenAttendanceDialog}
                            disableElevation
                        >Take Attendance</Button>
                        <Button 
                            className="mFont"
                            startIcon={<AddIcon/>}
                            color="primary"
                            variant="contained" 
                            style={{marginRight:20}}
                            onClick={handleOpenDialog}
                            disableElevation
                        >Add Employees</Button>
                    </Box>
                </Grid>
            </Grid>
            <Divider style={{marginTop:10}}/>
            <Alerts/>
            {props.employees.length <= 0 ?
                <Box style={{width:"100%",marginTop:40}}>
                    <Typography style={{textAlign:"center"}}><PersonAddDisabledIcon/></Typography>
                    <Typography style={{textAlign:"center"}}>No Employees Added yet.</Typography>
                </Box>
                :
                <EmployeeTable/>
            }
            </Box>
            
            <AttendanceDialog/>

            <Dialog open={openAddEmployee} onClose={handleCloseDialog} fullWidth maxWidth="lg">
                <DialogTitle className='mFont'>Add Employee</DialogTitle>
                <Divider/>
                <form onSubmit={(e)=>handleFormSubmit(e)} encType="multipart/form-data">
                    <DialogContent>
                        {props.alert.length > 0 && <Alerts/>}
                        <Box style={{marginTop:10,marginBottom:10}}>
                            <Typography style={{letterSpacing:2}} variant="h6">BASIC INFORMATION</Typography>
                        </Box>
                        <Box>
                            {ProfilePic === null ? 
                                <Box style={{width:200,height:200,border:"1px solid black"}}></Box>
                                :
                                <img src={ProfilePic} width="200px" height="200px" alt="unable to display." style={{border:"1px solid black"}}/>
                            }
                            <Box display='flex' flexDirection='row'>
                                <Box> 
                                    <Typography variant="h6" className={classes.customText}>Upload Employee Photo</Typography>
                                </Box>
                                <Box style={{marginLeft:10}}>
                                    <input
                                        name="EmployeeProfilePic"
                                        variant="outlined"
                                        onChange={handleChangeDocuments}
                                        className={classes.customFileInput}
                                        type="file"
                                        accept="image/*"
                                        required
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box display='flex' flexDirection='row'>
                            <Box>
                                <TextField
                                    name="EmployeeName"
                                    variant="outlined"
                                    className={classes.customInput}
                                    type="text"
                                    placeholder="Employee Name"
                                    label="Employee Name"
                                    onChange={handleChange}
                                    required
                                />
                            </Box>
                            <Box style={{marginLeft:10}}>
                                <TextField
                                    name="EmployeeAddress"
                                    variant="outlined"
                                    className={classes.customInput}
                                    type="text"
                                    onChange={handleChange}
                                    placeholder="Employee Address"
                                    label="Employee Address"
                                    required
                                />
                            </Box>
                            <Box style={{marginLeft:10}}>
                                <TextField
                                    name="EmployeeDOB"
                                    variant="outlined"
                                    className={classes.customInput}  
                                    type="date"
                                    onChange={handleChange}
                                    label="Date of Birth"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                            </Box>
                        </Box>
                        <Box display='flex' flexDirection='row'>
                            
                            <Box>
                                <TextField
                                    name="EmployeePhone"
                                    variant="outlined"
                                    className={classes.customInput}
                                    type="number"
                                    onChange={handleChange}
                                    placeholder="Employee Phone"
                                    label="Employee Phone"
                                    required
                                />
                            </Box>
                            <Box style={{marginLeft:10}}>    
                                <Autocomplete
                                    name="EmployeePost"
                                    onInputChange={(e,newInputValue)=>{
                                        setDetails({...EmpDetails,"EmployeePost":newInputValue});
                                    }}
                                    className={classes.customInput}
                                    options={['Owner','Manager','Waiter','Chef','Cleaner','Co-worker','Helper']}
                                    renderInput={(params)=>
                                        
                                        <TextField
                                            {...params}
                                            variant="outlined" 
                                            placeholder="Employee Post"
                                            label="Employee Post"
                                            required
                                        />
                                    }
                                />
                            </Box>
                            <Box style={{marginLeft:10}}>
                                <TextField
                                    name="EmployeeSalary"
                                    variant="outlined"
                                    className={classes.customInput}
                                    type="number"
                                    onChange={handleChange}
                                    placeholder="Employee Salary"
                                    label="Employee Salary"
                                    required
                                />
                            </Box>
                        </Box>
                
                        <Box style={{marginTop:10,marginBottom:10}}>
                            <Typography style={{letterSpacing:2}} variant="h6">DOCUMENT INFORMATION</Typography>
                        </Box>
                        
                        <Box display='flex' flexDirection='row'>
                            <Box>
                                <Typography variant="h6" className={classes.customText}>Aadhar Details</Typography>
                            </Box>
                            <Box style={{marginLeft:10}}>
                                <input
                                    name="EmployeeAadharPic"
                                    variant="outlined"
                                    onChange={handleChangeDocuments}
                                    className={classes.customFileInput}
                                    type="file"
                                    required
                                />
                            </Box>
                            <Box style={{marginLeft:10}}>
                                <TextField
                                    name="EmployeeAadhar"
                                    variant="outlined"
                                    className={classes.customInput}
                                    type="number"
                                    onChange={handleChange}
                                    placeholder="Employee Aadhar Number"
                                    label="Employee Aadhar Number"
                                    required
                                />
                            </Box>
                        </Box>
                        
                        <Box display='flex' flexDirection='row'>
                            <Box>
                                <Typography variant="h6" className={classes.customText}>Pan Details</Typography>
                            </Box>
                            <Box style={{marginLeft:10}}>
                                <input
                                    name="EmployeePanPic"
                                    variant="outlined"
                                    onChange={handleChangeDocuments}
                                    className={classes.customFileInput}
                                    type="file"
                                    required
                                />
                            </Box>
                            <Box style={{marginLeft:10}}>
                                <TextField
                                    name="EmployeePan"
                                    variant="outlined"
                                    className={classes.customInput}
                                    type="text"
                                    onChange={handleChange}
                                    placeholder="Employee Pan Number"
                                    label="Employee Pan Number"
                                    required
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <Divider/>
                    <DialogActions>
                        <Button variant="contained" style={{color:"black"}} onClick={handleCloseDialog}>CANCEL</Button>
                        <Button type="submit" variant="contained" color="primary" style={{marginLeft:10}}>SAVE</Button>
                    </DialogActions>
                </form>
            </Dialog>
        
        </Box>
    );
    }
}

const mapStateToProps = state =>({
    alert : state.alert,
    employees : state.employees,
    loading : state.loading,
    attendance : state.attendance
});

export default connect(mapStateToProps,{
    saveEmployee, 
    getEmployees, 
    deleteEmployee, 
    setLoading, 
    saveAttendance,
    getAttendance
})(Employees);