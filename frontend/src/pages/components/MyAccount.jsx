import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Avatar, Box, Button, Divider, 
    Grid, Typography, Dialog, 
    DialogTitle, DialogContent, 
    TextField, DialogActions, MenuItem,
    } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { green, pink, deepOrange } from '@material-ui/core/colors';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { 
    basicUpdate,
    updateName, 
    updateLocation,
    updateTable,
    loadUser,
    addTax,
    removeTax,
    updateUPI
} from '../../actions/auth';
import Alert from './Alerts';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({

    themeColor : {
        color: theme.palette.getContrastText("#ffd31d"),
        backgroundColor: "#ffd31d",
        width : "150px",
        height : "150px",
        fontSize : "50px",
        
    },
    
    pink: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
        padding : "10px",
        height : "100px"
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
        padding : "10px",
        height : "100px"
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        padding : "10px",
        height : "100px"
    },
    mBox: {
        padding: 20,
        marginTop: 10,
        boxShadow:"0px 3px 6px rgba(0,0,0,16%)"
    }
}));

function MyAccount({user,basicUpdate,updateName,updateLocation,updateTable,loadUser,addTax,removeTax,updateUPI}){
    const classes = useStyles();
    const [open,setOpen] = React.useState(false);
    const [formData,setFormData] = React.useState({
        RestaurantName : '',
        Location : '',
        Phone : null,
        nTables : null
    });
    const [taxData,setTaxData] = React.useState({
        Name:'',
        Type:'',
        Amount:null
    });
    const [fileDialogOpen,setDialogOpen] = React.useState(false);
    
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    const [editName,setName] = React.useState('');
    const [editLocation,setLocation] = React.useState('');
    const [editTables,setTables] = React.useState(null);
    const [UPI, setUPI] = React.useState('');
    const [openName,setNameClose] = React.useState(false);
    const [openLocation,setLocationClose] = React.useState(false);
    const [openUPI, setUPIDialogClose] = React.useState(false);
    const [openTable,setTableClose] = React.useState(false);
    const [srcImg,setImg] = React.useState(null);

    const [files,setFile] = React.useState(null);

    function handleChangeName(e){ setName(e.target.value); }
    function handleCloseName(e){ setNameClose(false); }
    function handleChangeLocation(e){ setLocation(e.target.value); }
    function handleCloseLocation(e){ setLocationClose(false); }
    function handleChangeTable(e){ setTables(e.target.value); }
    function handleChangeUPI(e){ setUPI(e.target.value); }

    function handleCloseTable(e){ setTableClose(false); }
    function openNameDialog(){ setNameClose(true); }
    function openLocationDialog(){ setLocationClose(true); }
    function openTableDialog(){ setTableClose(true); }
    function openUPIDialog(){ setUPIDialogClose(true); }

    function handleCloseUPIDialog(){ setUPIDialogClose(false); }
    function handleClose(){ setOpen(false); }
    function handleFileDialogClose(){ setDialogOpen(false); }
    function handleChange(e){ setFormData({...formData,[e.target.name] : [e.target.value]}) }
    
    function handleUPISubmit(e){
        e.preventDefault();
        updateUPI({upiID : UPI})
        setUPIDialogClose(false);
    }

    function handleSubmit(e){
        e.preventDefault();
        basicUpdate({
            RestaurantName : formData.RestaurantName,
            Location : formData.Location,
            Phone : formData.Phone,
            nTables : formData.nTables
        });
        setOpen(false);
    }

    function handleNameSubmit(e){
        e.preventDefault();
        updateName({RestaurantName : editName});
        setNameClose(false);
    }
    function handleLocationSubmit(e){
        e.preventDefault();
        updateLocation({Location : editLocation});
        setLocationClose(false);
    }
    function handleTableSubmit(e){
        e.preventDefault();
        updateTable({nTables : editTables});
        setTableClose(false);
    }

    function handleImageSubmit(e){
        e.preventDefault();
        const config = {
            headers : {
                'Content-Type':'multipart/form-data'
            }
        }
        var formData = new FormData();
        formData.append("myFile",files);
        
        axios.post('/api/profile/upload',formData,config)
        .then((response)=>{if(response.data === "ok"){ loadUser(); }});
        
        handleFileDialogClose();
    }

    function handleAddTax(e){
        e.preventDefault();
        addTax(taxData);
    }
    
    function handleChangeImage(event){
        setFile(event.target.files[0]);
        setImg(URL.createObjectURL(event.target.files[0]));
    }

    function Header(){
        return(
            <Grid container>
                <Grid item sm={6} xs={6}>
                    <h3 className="mFont">My Account</h3>
                </Grid>
                <Grid item sm={6} xs={6}>
                    <Box textAlign="right" className={!isMobile && !isMobileDevice && "mr-20"}>
                        
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={()=>setOpen(true)}
                            startIcon={<EditIcon/>}
                            className="mFont"
                            >
                            Add/Edit Profile
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    if(isMobile || isMobileDevice ){
        return(
            <Box style={{marginLeft:"10px",marginRight:"10px"}}>

                <Header/>
                <Box style={{marginTop:40}}>
                <Grid container>
                    <Grid item sm={2} xs={5}>
                    { user.ImageUrl ? 
                        <Avatar className={classes.themeColor} src={user.ImageUrl} variant="rounded"></Avatar> :
                        <Avatar className={classes.themeColor} variant="rounded">{user.username[0]}</Avatar>
                    }
                    </Grid>
                    <Grid item sm={10} xs={7}>
                        <h4 className="mFont">{user.username}</h4>
                        <p className="mFont" style={{fontSize:"0.8rem"}}>{user.email}</p>
                        <Button 
                            variant="outlined" 
                            className="mFont" 
                            color="primary"
                            onClick={()=>setDialogOpen(true)}
                            startIcon={<PhotoCamera/>}
                            >Upload Image
                        </Button>
                        
                    </Grid>
                </Grid>
                </Box>
                <Typography style={{letterSpacing:2,marginTop:10}} variant="h6">BASIC DETAILS</Typography>
                <Box className={classes.mBox}>
                    <Box style={{marginTop:10}}>
                        <Grid container>
                            <Grid item xs={8} sm={8}>
                                <Typography> {user.RestaurantName ? user.RestaurantName : "Restaurant Name: "}</Typography>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <Box textAlign="right">
                                <Button onClick={openNameDialog} variant="outlined" color="primary">Edit</Button>
                                </Box>
                            </Grid>
                        </Grid>
                        
    
                    </Box>
                    <Box style={{marginTop:10}}>
                    <Grid container>
                        <Grid item xs={8} sm={8}>
                            <Typography>{user.Location ? user.Location : "Restaurant Address: "}</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <Box textAlign="right">
                                <Button onClick={openLocationDialog} variant="outlined" color="primary">Edit</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    
                    </Box>
                    <Box style={{marginTop:10}}>
                        <Grid container>
                            <Grid item xs={8} sm={8}>
                                <Typography>Number of Tables : { user.nTables }</Typography>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <Box textAlign="right">
                                    <Button onClick={openTableDialog} variant="outlined" color="primary">Edit</Button>
                                </Box>
                            </Grid>
                        </Grid>
                        
                    </Box>
                </Box>
                <Typography style={{letterSpacing:2,marginTop:10}} variant="h6">TAXES & CHARGES</Typography>
                <Alert/>
                <Box className={classes.mBox}>
                {user.Taxes.length > 0 ?
                <Grid container style={{paddingTop:5,paddingBottom:5,marginTop:5,backgroundColor:"#FFD31D"}}>
                    <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>Tax Name</Typography></Grid>
                    <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>Type of tax</Typography></Grid>
                    <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>Amount</Typography></Grid>
                    <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>Delete</Typography></Grid>
                </Grid>
                :
                <Typography className="mFont" color="textSecondary" style={{textAlign:"center"}}>No Taxes added</Typography>
                }
                {user.Taxes.length > 0 &&
                user.Taxes.map((tax)=>(
                    <Grid container style={{marginTop:5}}>
                        <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>{tax.TaxName}</Typography></Grid>
                        <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>{tax.TaxType}</Typography></Grid>
                        <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>{tax.Amount}</Typography></Grid>
                        <Grid item xs={3} sm={3} style={{textAlign:"center"}}>
                        <Button 
                        startIcon={<DeleteIcon/>} variant='outlined' 
                        color="secondary" className="mFont"
                        onClick={()=>{removeTax({Name:tax.TaxName,Type:tax.TaxType,Amount:tax.Amount})}}
                        >Delete</Button>
                        </Grid>
                    </Grid>
                ))
                }
                </Box>
                <Box className={classes.mBox} style={{marginTop:10,justifyContent:"center",alignContent:"center"}}>
                    <form onSubmit={(e)=>handleAddTax(e)}>
                        <TextField
                            label="Name of Tax or Charges"
                            className="mFont customInput"
                            name="TaxName"
                            variant="outlined"
                            style={{marginTop:10,marginLeft:5,marginRight:5}}
                            onChange={(e)=>setTaxData({...taxData,Name:e.target.value})}
                            required
                            fullWidth
                        />
                        <TextField
                            select
                            label="Select Type of Tax"
                            className="mFont customInput"
                            variant="outlined"
                            style={{marginTop:10,marginLeft:5,marginRight:5}}
                            onChange={(e)=>setTaxData({...taxData,Type:e.target.value})}
                            required
                            fullWidth
                            >
                            <MenuItem key={1} value="Percentage">
                                Percentage
                            </MenuItem>
                            <MenuItem key={2} value="Fixed">
                                Fixed Amount
                            </MenuItem>
                        </TextField>
                        <TextField
                            label="Amount"
                            className="mFont customInput"
                            style={{marginTop:10,marginLeft:5,marginRight:5}}
                            name="TaxAmount"
                            type="number"
                            variant="outlined"
                            onChange={(e)=>setTaxData({...taxData,Amount:e.target.value})}
                            required
                            fullWidth
                        />
                        <Button 
                            type="submit" 
                            variant="outlined" 
                            color="primary" 
                            style={{marginTop:10,marginLeft:5,marginRight:5}}
                            startIcon={<AddIcon/>}
                            fullWidth
                            >ADD TAX</Button>
                    </form>
                </Box>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Profile</DialogTitle>
                    <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Alert/>
                        <TextField
                            className="mFont customInput"                                    
                            label="Restaurant Name"
                            name="RestaurantName"
                            onChange={e => handleChange(e)}
                            required
                        />
                        <br/><br/>
                        <TextField
                            label="Restaurant Address"
                            className="mFont customInput"
                            name="Location"
                            onChange={e => handleChange(e)}
                            required
                        />
                        <br/><br/>
                        <TextField
                            label="Phone"
                            name="Phone"
                            className="mFont customInput"
                            onChange={e => handleChange(e)}
                            type="tel"
                            required
                        />
                        <br/><br/>
                        <TextField
                            label="Number of Table"
                            className="mFont customInput"
                            name="nTables"                                    
                            type="number"
                            onChange={e => handleChange(e)}
                            required
                        />
                        <br/><br/>
                        
                        <DialogActions>
                        <Button onClick={handleClose} variant="contained">Close</Button>
                        <Button variant="contained" color="primary"
                        startIcon={<SaveIcon/>} type="submit">Save</Button>
                    </DialogActions>
                </DialogContent>
                </form>
            </Dialog>
                <Dialog open={openTable} onClose={handleCloseTable}>
                    <Alert/>
                    <form onSubmit={handleTableSubmit}>
                    <DialogContent>
                        <TextField
                            label="Number of Table"
                            className="mFont customInput"
                            name="nTables"                                    
                            type="number"
                            onChange={e => handleChangeTable(e)}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                            <Button onClick={handleCloseTable} variant="contained">Close</Button>
                            <Button variant="contained" color="primary"
                            startIcon={<SaveIcon/>} type="submit">Save</Button>
                    </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={openLocation} onClose={handleCloseLocation}>
                    <Alert/>
                    <form onSubmit={handleLocationSubmit}>
                    <DialogContent>
                        <TextField
                            label="Restaurant Address"
                            className="mFont customInput"
                            name="Location"
                            onChange={e => handleChangeLocation(e)}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                            <Button onClick={handleCloseLocation} variant="contained">Close</Button>
                            <Button variant="contained" color="primary"
                            startIcon={<SaveIcon/>} type="submit">Save</Button>
                    </DialogActions>
                    </form>
                </Dialog> 
                <Dialog open={openName} onClose={handleCloseName}>
                    <Alert/>
                    <form onSubmit={handleNameSubmit}>
                        <DialogContent>
                            <TextField
                                className="mFont customInput"                                    
                                label="Restaurant Name"
                                name="RestaurantName"
                                onChange={e => handleChangeName(e)}
                                required
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseName} variant="contained">Close</Button>
                            <Button variant="contained" color="primary"
                            startIcon={<SaveIcon/>} type="submit">Save</Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={fileDialogOpen} onClose={handleFileDialogClose}>
                    <DialogTitle>Upload Image</DialogTitle>
                    <Alert/>
                    <form 
                    onSubmit={(e)=>handleImageSubmit(e)} 
                    encType="multipart/form-data">
                    <DialogContent>
                        <img id="imagePreview" alt="" src={srcImg} width="100px" height="100px"/><br/>
                        <br/>
                        <input
                            type="file"
                            accept="image/*"
                            id="imageInp"
                            onChange={(e)=>handleChangeImage(e)}
                            name="myFile"/>
                        <br/><br/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFileDialogClose} variant="contained">Close</Button>
                        <Button variant="contained" color="primary"
                        startIcon={<CloudUploadIcon/>} type="submit">Upload Image</Button>
                    </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={openUPI} onClose={handleCloseUPIDialog}>
                    <Alert/>
                    <form onSubmit={handleUPISubmit}>
                    <DialogContent>
                        <TextField
                            className="mFont customInput"                                    
                            label="UPI Id"
                            name="upiID"
                            onChange={e => handleChangeUPI(e)}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseUPIDialog} variant="contained">Close</Button>
                        <Button variant="contained" color="primary"
                        startIcon={<SaveIcon/>} type="submit">Save</Button>
                    </DialogActions>
                    </form>
                </Dialog>
            
            </Box> 
        );
    }
    else{
    return(
        <Box>
            <Box>
                <Header/>
                <Divider style={{marginTop:10}}/>
                <br/>
                <Grid container spacing={2}>
                    <Grid item sm={2}>
                    { user.ImageUrl ? 
                        <Avatar className={classes.themeColor} src={user.ImageUrl} variant="rounded"></Avatar> :
                        <Avatar className={classes.themeColor} variant="rounded">{user.username[0]}</Avatar>
                    }
                    </Grid>
                    <Grid item sm={8}>
                        <h4 className="mFont">{user.username}</h4>
                        <p className="mFont">{user.email}</p>
                        <Button 
                            variant="outlined" 
                            className="mFont" 
                            color="primary"
                            onClick={()=>setDialogOpen(true)}
                            startIcon={<PhotoCamera/>}
                            >Upload Image</Button>
                            
                    </Grid>
                </Grid>
                <br></br>
                <Typography style={{letterSpacing:2}} variant="h6">BASIC DETAILS</Typography>
                <Box className={classes.mBox}>
                    <Box style={{marginTop:10}}>
                        <Grid container>
                            <Grid item sm={8} xs={8}>
                                <Typography>{user.RestaurantName ? user.RestaurantName : "Restaurant Name: "}</Typography>
                            </Grid>
                            <Grid item sm={4} xs={4}>
                                <Box textAlign="right">
                                <Button onClick={openNameDialog} variant="outlined" color="primary">Edit</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box style={{marginTop:10}}>
                        <Grid container>
                            <Grid item sm={8} xs={8}>
                                <Typography> Number of Tables: {user.nTables}</Typography>
                            </Grid>
                            <Grid item sm={4} xs={4}>
                                <Box textAlign="right">
                                    <Button onClick={openTableDialog} variant="outlined" color="primary">Edit</Button>
                                </Box>
                                
                        
                            </Grid>
                        </Grid>
                    </Box>
                    <Box style={{marginTop:10}}>
                        <Grid container>
                            <Grid item sm={8} xs={8}>
                                <Typography>{user.Location ? user.Location : "Restaurant Address: "}</Typography>
                            </Grid>
                            <Grid item sm={4} xs={4}>
                                <Box textAlign="right">
                                    <Button onClick={openLocationDialog} variant="outlined" color="primary">Edit</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box style={{marginTop:10}}>
                        <Grid container>
                            <Grid item sm={8} xs={8}>
                                <Typography>{user.UPIID ? user.UPIID : "UPI ID: "}</Typography>
                            </Grid>
                            <Grid item sm={4} xs={4}>
                                <Box textAlign="right">
                                    <Button onClick={openUPIDialog} variant="outlined" color="primary">Edit</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Typography style={{letterSpacing:2,marginTop:10}} variant="h6">TAXES & CHARGES</Typography>
                <Alert/>
                <Box className={classes.mBox}>
                {user.Taxes.length > 0 ?
                <Grid container style={{paddingTop:5,paddingBottom:5,marginTop:5,backgroundColor:"#FFD31D"}}>
                    <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>Tax Name</Typography></Grid>
                    <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>Type of tax</Typography></Grid>
                    <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>Amount</Typography></Grid>
                    <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>Delete</Typography></Grid>
                </Grid>
                :
                <Typography className="mFont" color="textSecondary" style={{textAlign:"center"}}>No Taxes added</Typography>
                }
                {user.Taxes.length > 0 &&
                user.Taxes.map((tax)=>(
                    <Grid container style={{marginTop:5}}>
                        <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>{tax.TaxName}</Typography></Grid>
                        <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>{tax.TaxType}</Typography></Grid>
                        <Grid item xs={3} sm={3}><Typography className="mFont" style={{textAlign:"center"}}>{tax.Amount}</Typography></Grid>
                        <Grid item xs={3} sm={3} style={{textAlign:"center"}}>
                        <Button 
                        startIcon={<DeleteIcon/>} variant='outlined' 
                        color="secondary" className="mFont"
                        onClick={()=>{removeTax({Name:tax.TaxName,Type:tax.TaxType,Amount:tax.Amount})}}
                        >Delete</Button>
                        </Grid>
                    </Grid>
                ))
                }
                </Box>
                <Box className={classes.mBox} style={{justifyContent:"center",alignSelf:"center"}}>
                    <form onSubmit={(e)=>handleAddTax(e)}>
                        <TextField
                            label="Name of Tax or Charges"
                            className="mFont customInput"
                            name="TaxName"
                            variant="outlined"
                            style={{marginRight:5}}
                            onChange={(e)=>setTaxData({...taxData,Name:e.target.value})}
                            required
                        />
                        <TextField
                            select
                            label="Select Type of Tax"
                            className="mFont customInput"
                            variant="outlined"
                            style={{marginLeft:5,marginRight:5}}
                            onChange={(e)=>setTaxData({...taxData,Type:e.target.value})}
                            required
                            >
                            <MenuItem key={1} value="Percentage">
                                Percentage
                            </MenuItem>
                            <MenuItem key={2} value="Fixed">
                                Fixed Amount
                            </MenuItem>
                        </TextField>
                        <TextField
                            label="Amount"
                            className="mFont customInput"
                            style={{marginLeft:5,marginRight:5}}
                            name="TaxAmount"
                            type="number"
                            variant="outlined"
                            onChange={(e)=>setTaxData({...taxData,Amount:e.target.value})}
                            required
                        />
                        <Button 
                            type="submit" 
                            variant="outlined" 
                            color="primary" 
                            style={{paddingTop:15,paddingBottom:15,paddingLeft:15,paddingRight:15}}
                            startIcon={<AddIcon/>}>ADD TAX</Button>
                    </form>
                </Box>
                
                
            </Box>

                <Dialog open={openLocation} onClose={handleCloseLocation}>
                <Alert/>
                <form onSubmit={handleLocationSubmit}>
                <DialogContent>
                    <TextField
                        label="Restaurant Address"
                        className="mFont customInput"
                        name="Location"
                        onChange={e => handleChangeLocation(e)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                        <Button onClick={handleCloseLocation} variant="contained">Close</Button>
                        <Button variant="contained" color="primary"
                        startIcon={<SaveIcon/>} type="submit">Save</Button>
                </DialogActions>
                </form>
            </Dialog>
                <Dialog open={openTable} onClose={handleCloseTable}>
                    <Alert/>
                    <form onSubmit={handleTableSubmit}>
                    <DialogContent>
                        <TextField
                            label="Number of Table"
                            className="mFont customInput"
                            name="nTables"                                    
                            type="number"
                            onChange={e => handleChangeTable(e)}
                                required
                            />
                    </DialogContent>
                    <DialogActions>
                            <Button onClick={handleCloseTable} variant="contained">Close</Button>
                            <Button variant="contained" color="primary"
                            startIcon={<SaveIcon/>} type="submit">Save</Button>
                    </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={openName} onClose={handleCloseName}>
                    <Alert/>
                    <form onSubmit={handleNameSubmit}>
                    <DialogContent>
                        <TextField
                            className="mFont customInput"                                    
                            label="Restaurant Name"
                            name="RestaurantName"
                            onChange={e => handleChangeName(e)}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseName} variant="contained">Close</Button>
                        <Button variant="contained" color="primary"
                        startIcon={<SaveIcon/>} type="submit">Save</Button>
                    </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={fileDialogOpen} onClose={handleFileDialogClose}>
                    <DialogTitle>Upload Image</DialogTitle>
                    <Alert/>
                    <form 
                    onSubmit={(e)=>handleImageSubmit(e)} 
                    encType="multipart/form-data">
                    <DialogContent>
                        <img id="imagePreview" alt="" src={srcImg} width="100px" height="100px"/><br/>
                        <br/>
                        <input
                            type="file"
                            accept="image/*"
                            id="imageInp"
                            onChange={(e)=>handleChangeImage(e)}
                            name="myFile"/>
                        <br/><br/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFileDialogClose} variant="contained">Close</Button>
                        <Button variant="contained" color="primary"
                        startIcon={<CloudUploadIcon/>} type="submit">Upload Image</Button>
                    </DialogActions>
                    </form>
                </Dialog>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Profile</DialogTitle>
                    <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Alert/>
                        <TextField
                            className="mFont customInput"                                    
                            label="Restaurant Name"
                            name="RestaurantName"
                            onChange={e => handleChange(e)}
                            required
                        />
                        <br/><br/>
                        <TextField
                            label="Restaurant Address"
                            className="mFont customInput"
                            name="Location"
                            onChange={e => handleChange(e)}
                            required
                        />
                        <br/><br/>
                        <TextField
                            label="Phone"
                            name="Phone"
                            className="mFont customInput"
                            onChange={e => handleChange(e)}
                            type="tel"
                            required
                        />
                        <br/><br/>
                        <TextField
                            label="Number of Table"
                            className="mFont customInput"
                            name="nTables"                                    
                            type="number"
                            onChange={e => handleChange(e)}
                            required
                        />
                        <br/><br/>
                        
                        <DialogActions>
                            <Button onClick={handleClose} variant="contained">Close</Button>
                            <Button variant="contained" color="primary"
                            startIcon={<SaveIcon/>} type="submit">Save</Button>
                        </DialogActions>
                    </DialogContent>
                    </form>
                </Dialog>      
                <Dialog open={openUPI} onClose={handleCloseUPIDialog}>
                    <Alert/>
                    <form onSubmit={handleUPISubmit}>
                    <DialogContent>
                        <TextField
                            className="mFont customInput"                                    
                            label="UPI Id"
                            name="upiID"
                            onChange={e => handleChangeUPI(e)}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseUPIDialog} variant="contained">Close</Button>
                        <Button variant="contained" color="primary"
                        startIcon={<SaveIcon/>} type="submit">Save</Button>
                    </DialogActions>
                    </form>
                </Dialog>

        </Box>
    );
    }
}

MyAccount.propTypes = {
    user : PropTypes.object.isRequired,
    basicUpdate : PropTypes.func.isRequired,
    updateName : PropTypes.func.isRequired,
    updateLocation : PropTypes.func.isRequired,
    updateTable : PropTypes.func.isRequired,
    loadUser : PropTypes.func.isRequired,
    addTax : PropTypes.func.isRequired,
    removeTax : PropTypes.func.isRequired,
    updateUPI : PropTypes.func.isRequired,
};

const mapStateToProps = state=>({
    user : state.auth.user
});

export default connect(mapStateToProps,{basicUpdate,updateName,updateLocation,updateTable,loadUser,addTax,removeTax,updateUPI})(MyAccount);