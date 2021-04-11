import React from 'react';
import { Box, LinearProgress } from '@material-ui/core';
import Logo from '../../assets/logo.png';

function LoadingScreen(props) {
    
    return (
        <Box style={{
            display:"flex",
            justifyContent:"center",
            alignContent:'center',
            marginTop:'20%',
        }}>
            <Box>
                <img src={Logo} height={50} alt=''/>
                <LinearProgress /> 
            </Box>
        </Box>
    );
}

export default LoadingScreen;