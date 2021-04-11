import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    AppBar, Toolbar,IconButton, 
    Typography, Box, Divider, TextField,
    InputAdornment, Grid, Button
} from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';
import Logo from '../assets/logo.png';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import DialpadOutlinedIcon from '@material-ui/icons/DialpadOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';
import Alerts from '@material-ui/lab/Alert';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const useStyles = makeStyles((theme)=>({

    LoginInput : {
        width:'24rem',
        marginTop:'20px',
        padding:'10px',
        fontSize:'larger'
    },
    mobileLoginInput : {
        width : '100%',
        marginTop:'20px',
        padding:'10px',
        fontSize:'larger'
    }

}));

const CustomTextField = withStyles({
    root : {
        '& label.Mui-focused': {
            color: '#FFD31D',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#FFD31D',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
        },
        '&:hover fieldset': {
          borderColor: '#FFD31D',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#FFD31D',
          
        },
        }
    }
})(TextField);

function Forgot(){
    
    const classes = useStyles();
    const [email,setEmail] = React.useState("");
    const [otp,setOtp] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [confirmPassword,setConfirmPassword] = React.useState("");
    
    const [visibility,setVisible] = React.useState(false);
    const [alert,showAlert] = React.useState(false);
    const [type,setType] = React.useState("");
    const [message,setMessage] = React.useState("");

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    function handleEmail(e){ setEmail(e.target.value); } 
    function handleOTP(e){ setOtp(e.target.value); }
    function handlePassword(e){ setPassword(e.target.value); }
    function handleConfirmPassword(e){ setConfirmPassword(e.target.value); }

    function onSubmit(e){
        e.preventDefault();
        const config = {
            headers : {
                'Content-Type':'application/json'
            }
        };
        const body = JSON.stringify({email:email});
        axios.post("/api/users/send/otp",body,config)
        .then((response)=>{
            if(response.data === "Email Sent"){
                setType("success");
                setMessage("Email Send Successfully");
                showAlert(true);
                setVisible(true);
            }
            if(response.data === "User does not Exists"){
                setType("error");
                setMessage("User does not Exists");
                showAlert(true);
            }
        });
    }

    function onSubmitChange(e){
        e.preventDefault();
        
        if(password === confirmPassword){
            const config = {
                headers : {
                    'Content-Type':'application/json'
                }
            };
            const body = JSON.stringify({email:email,password:password,otp:otp});
            axios.post("/api/users/changepassword",body,config)
            .then((response)=>{
            if(response.data === "Password changed Successfully"){
                setType("success");
                setMessage("Password changed Successfully"); 
                showAlert(true);
            }
            if(response.data === "Invalid One Time Password"){
                setType("error");
                setMessage("Invalid One Time Password");
                showAlert(true);
            }
        });
        }else{
            setType("error");
            setMessage("Password and Confirm Password does'nt match.");
            showAlert(true);
        }
    }

    return(
        <div className="LoginParent">
            <AppBar position="static" style={{backgroundColor:"#FFF"}}>
                <Toolbar>
                    <IconButton edge="start">
                        <img src={Logo} width="40" alt="Logo"/>
                    </IconButton>
                    <Typography className="logoFont navbar-brand" variant="h6">
                        Serve My Table
                    </Typography>
                </Toolbar>
            </AppBar>
            {alert && <Alerts variant="filled" severity={type}>{message}</Alerts>}
            {isMobile || isMobileDevice ? 
                <Box className="LoginChild">
                    <form onSubmit={e=>onSubmit(e)}>
                    <Box style={{marginLeft:"5px"}}>
                        <p className="mFont">Forgot your password</p>
                        <Divider/>
                        
                    </Box>
                    <Box>
                    <CustomTextField 
                        name="email"
                        onChange={handleEmail} 
                        value={email} 
                        variant="outlined"
                        className={classes.mobileLoginInput}
                        InputProps={{
                            startAdornment:(
                                <InputAdornment position="start">
                                    <MailOutlineRoundedIcon/>
                                </InputAdornment>
                            ),
                        }}
                        type="email"
                        placeholder="Email Address *"
                        required
                        />
                    </Box>

                    <Box>
                        <button type="submit" className="LoginBtn">Send OTP</button>
                    </Box>
                    
                    </form>
                    <br/>
                    <Box>
                        <Button 
                            href="/" 
                            alt="toLoginPage" 
                            className="mFont forgotpassword"
                            startIcon={<ChevronLeftIcon/>}
                            variant="outlined"
                        >Back to Login
                        </Button>
                    </Box>

                    { visibility &&
                    
                    <form onSubmit={e=>onSubmitChange(e)} style={{marginTop:"10px"}}>

                        <Box style={{marginLeft:"5px"}}>
                            <p className="mFont">Reset your password</p>
                            <Divider/>
                            
                        </Box>

                                <Box>
                                    <CustomTextField
                                        name="otp"
                                        onChange={handleOTP} 
                                        value={otp} 
                                        variant="outlined"
                                        className={classes.mobileLoginInput}
                                        InputProps={{
                                            startAdornment:(
                                                <InputAdornment position="start">
                                                    <DialpadOutlinedIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        type="text"
                                        placeholder="OTP *"
                                        required
                                    />
                                </Box>

                                <Box>
                                    <CustomTextField
                                        name="password" 
                                        onChange={handlePassword} 
                                        value={password} 
                                        variant="outlined"
                                        className={classes.mobileLoginInput}
                                        style={{marginTop:"5px"}}
                                        InputProps={{
                                            startAdornment:(
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        type="password"
                                        placeholder="Password *" 
                                        required
                                    />
                                </Box>
                                
                                <Box>
                                    <CustomTextField
                                        name="password" 
                                        onChange={handleConfirmPassword} 
                                        value={confirmPassword} 
                                        variant="outlined"
                                        className={classes.mobileLoginInput}
                                        style={{marginTop:"5px"}}
                                        InputProps={{
                                            startAdornment:(
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        type="password"
                                        placeholder="Confirm Password *" 
                                        required
                                    />
                                </Box>
                                <Box>
                                    <button type="submit" className="LoginBtn">Change Password</button>
                                </Box>
                            </form>
                    
                    }
                </Box>
            :
            <Grid container className="LoginChild">
            <Grid item sm={6} xs={6}>
                
                <form onSubmit={e=>onSubmit(e)}>
                    <Box style={{marginLeft:"5px"}}>
                        <p className="mFont">Forgot your password</p>
                        
                    </Box>
                    <Box>
                    <CustomTextField 
                        name="email"
                        onChange={handleEmail} 
                        value={email} 
                        variant="outlined"
                        className={classes.LoginInput}
                        InputProps={{
                            startAdornment:(
                                <InputAdornment position="start">
                                    <MailOutlineRoundedIcon/>
                                </InputAdornment>
                            ),
                        }}
                        type="email"
                        placeholder="Email Address *"
                        required
                        />
                    </Box>

                    <Box>
                        <button type="submit" className="LoginBtn">Send OTP</button>
                    </Box>
                    
                    </form>  
                <br/>
                <Box>
                    <Button 
                    href="/" 
                    alt="toLoginPage" 
                    className="mFont forgotpassword"
                    startIcon={<ChevronLeftIcon/>}
                    variant="outlined"
                    >Back to Login
                    </Button>
                </Box>
            </Grid>
                { visibility &&
                    <Grid item sm={6} xs={6}>
                        <form onSubmit={e=>onSubmitChange(e)}>

                                <Box style={{marginLeft:"5px"}}>
                                    <p className="mFont">Reset your password</p>
                                </Box>

                                <Box>
                                    <CustomTextField
                                        name="otp"
                                        onChange={handleOTP} 
                                        value={otp} 
                                        variant="outlined"
                                        className={classes.LoginInput}
                                        InputProps={{
                                            startAdornment:(
                                                <InputAdornment position="start">
                                                    <DialpadOutlinedIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        type="text"
                                        placeholder="OTP *"
                                        required
                                    />
                                </Box>

                                <Box>
                                    <CustomTextField
                                        name="password" 
                                        onChange={handlePassword} 
                                        value={password} 
                                        variant="outlined"
                                        className={classes.LoginInput}
                                        style={{marginTop:"5px"}}
                                        InputProps={{
                                            startAdornment:(
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        type="password"
                                        placeholder="Password *" 
                                        required
                                    />
                                </Box>
                                
                                <Box>
                                    <CustomTextField
                                        name="password" 
                                        onChange={handleConfirmPassword} 
                                        value={confirmPassword} 
                                        variant="outlined"
                                        className={classes.LoginInput}
                                        style={{marginTop:"5px"}}
                                        InputProps={{
                                            startAdornment:(
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        type="password"
                                        placeholder="Confirm Password *" 
                                        required
                                    />
                                </Box>
                                <Box>
                                    <button type="submit" className="LoginBtn">Change Password</button>
                                </Box>

                            </form>
                    </Grid>
                }
            </Grid>
            }

        </div>
    );
}

export default Forgot;