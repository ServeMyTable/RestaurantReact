import React from 'react';

import { Avatar, Box, LinearProgress  } from '@material-ui/core';
import Logo from '../../assets/logo.png';

function Loading(){
    return(
        <Box
            display='flex'
            alignContent="center"
            justifyContent="center"
            style={{ marginTop:'20%' }}
            >

            <Box>
                <Avatar src={Logo} variant='rounded' style={{width:'100px',height:'auto'}}/>
                <LinearProgress style={{color : "#FFD31D"}}/>
            </Box>   

        </Box> 
    );
}

export default Loading;