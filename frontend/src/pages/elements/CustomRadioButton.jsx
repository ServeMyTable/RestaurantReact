import React from 'react';

import { Box, Typography, Radio } from "@material-ui/core";

const styles = {
    Box:{
        padding:10,
        display :"flex",
        flexDirection:"row",
        border:"1px solid #e0e0e0",
        borderRadius : 5,    
    },
    selectedBox:{
        padding:10,
        display :"flex",
        flexDirection:"row",
        border:"1px solid #3F51B5",
        borderRadius : 5,
    }
};

function CustomRadioButton({PlanName,PlanPrice,selected,onClick}) {
    
    return (
        <Box style={ !selected ? styles.Box : styles.selectedBox}>
            <Box>
                <Radio color="primary" checked={selected} onClick={onClick}/>
            </Box>
            <Box textAlign="left">
                <Typography className="mFont">{PlanName}</Typography>
                <Typography className="mFont" color="textSecondary"> Rs {PlanPrice}</Typography>
            </Box>    
        </Box>
    );
}

export default CustomRadioButton;