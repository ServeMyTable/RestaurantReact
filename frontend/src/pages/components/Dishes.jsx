import React from 'react';
import { 
    Button, Card, CardActions, CardContent, FormControlLabel,
    Dialog, DialogActions, DialogContent, Checkbox, TextField,
    DialogTitle, Divider, Typography, Grid, Box, InputAdornment,
    Avatar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import {makeStyles} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { addDish, deleteDish, updateDish, availableDish} from '../../actions/dish';
import { loadUser } from '../../actions/auth';

import Alert from './Alerts';
import { setLoading } from '../../actions/loading';
import LoadingScreen from '../elements/LoadingScreen';

const useStyles = makeStyles((theme)=>({
    customInput:{
        marginTop:10,
        marginBottom:10,
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
}));


function Dishes({loading,Categories,Dishes, addDish, updateDish, loadUser, deleteDish, availableDish,setLoading}){
    
    const classes = useStyles();
    const [mtags,setTags] = React.useState({
        'Veg':false,
        'Non Veg':false,
        'Speciality':false,
        'Sweet':false,
        'Spicy':false,
        'Med. Spicy':false,
    });
    const [utags,setUpdateTags] = React.useState({
        'Veg':false,
        'Non Veg':false,
        'Speciality':false,
        'Sweet':false,
        'Spicy':false,
        'Med. Spicy':false
    });
    const [openAddDialog,setOpen] = React.useState(false);
    const [openUpdateDialog,setUpdateOpen] = React.useState(false);
    const [searchDish,setSearch]= React.useState('');
    const [DishPic,setDishPic] = React.useState(null);
    const [DishImage,setDishImage] = React.useState(null);

    const [updateDishPic,setUpdateDishPic] = React.useState(null);
    const [updateDishImage,setUpdateDishImage] = React.useState(null); 

    const [formData, setData] = React.useState({
        DishName:'',
        Description:'',
        Category:'',
        Price: 0,
    });
    const [editFormData, setEditData] = React.useState({
        DishName:'',
        Description:'',
        Category:'',
        Price: 0,
        OldFileName:null
    });

    const Tags = [
        'Veg',
        'Non Veg',
        'Speciality',
        'Sweet',
        'Spicy',
        'Med. Spicy',
    ];
    
    const [dishID,setDishID] = React.useState(null);

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isMobileDevice = useMediaQuery({query: '(max-device-width: 768px)'});

    const {DishName, Description, Category, Price} = formData;
    
    const onChange = e => setData({ ...formData, [e.target.name] : e.target.value });
    const onUpdateChange = e => setEditData({ ...editFormData, [e.target.name] : e.target.value });

    const [optionsCategory,setOptionCategories] = React.useState([]);

    function handleClick(){ setOpen(true); }
    function handleClose(){ setOpen(false); }
    function handleUpdateClose(){ setUpdateOpen(false); }

    function onSubmitForm(e){
        e.preventDefault();
        const identifiers = Object.keys(mtags);
        const nTag = identifiers.filter(function(id) {
            return mtags[id]
        });
        addDish({DishName, Description, Category, Price, tags:nTag,myFile:DishImage !== null ? DishImage.myFile:null});
        setLoading();
        loadUser();
        setOpen(false);
    }

    function onSubmitDelete(e){
        e.preventDefault();
        const [DeleteCategory,DishID,DishImageName]=[e.target[1].value,e.target[0].value,e.target[2].value]
        deleteDish({DeleteCategory,DishID,DishImageName});
        setLoading();
        loadUser();
    }

    function onSubmitUpdateForm(e){
        e.preventDefault();
        const identifiers = Object.keys(utags);
        const nTag = identifiers.filter(function(id) {
            return utags[id]
        });
        updateDish({
            DishName : editFormData.DishName,
            Description : editFormData.Description,
            Category : editFormData.Category,
            tags : nTag,
            Price : editFormData.Price,
            DishID : dishID,
            OldFileName:editFormData.OldFileName,
            myFile : updateDishImage !== null ? updateDishImage.myFile : null,
        });
        loadUser();
        setLoading();
        setUpdateOpen(false);
    }

    function onEditClick(e){

        e.preventDefault();
    
        const [
            DishName,
            Description,
            Category,
            Price,
            DishID,
            ImageUrl,
            OldFileName
        ] = 
        [
            e.target[0].value,
            e.target[1].value,
            e.target[2].value,
            e.target[3].value,
            e.target[4].value,
            e.target[5].value,
            e.target[6].value
        ];
        setDishID(DishID);
        
        setUpdateDishPic(ImageUrl);
        setEditData({DishName,Description,Category,Price,OldFileName});
        setUpdateOpen(true);
    }

    function onSubmitStatus(e){
        e.preventDefault();
        const DishID = e.target[0].value;
        const Status = e.target[1].value;
        availableDish({DishID,Status});
        loadUser();
    }

    function handleTags(event){ 
        setTags({ ...mtags, [event.target.name]: event.target.checked }); 
    }
    function handleUpdateTags(event){ 
        setUpdateTags({...utags, [event.target.name]: event.target.checked}); 
    }

    function handleSearch(e) { setSearch(e.target.value); }

    function getUniqueCategories(){ return Categories.filter((item,pos)=> Categories.indexOf(item) === pos) }
    
    if(getUniqueCategories().length !== optionsCategory.length){
        setOptionCategories([...getUniqueCategories()]);
    }
    const handleChangeDocuments = (e) =>{
        setDishImage({[e.target.name]:e.target.files[0]});
        if(e.target.name === "myFile"){
            setDishPic(URL.createObjectURL(e.target.files[0]));
        }
    };
    const handleChangeUpdateDocuments = (e) =>{
        setUpdateDishImage({[e.target.name]:e.target.files[0]});
        if(e.target.name === "myFile"){
            setUpdateDishPic(URL.createObjectURL(e.target.files[0]));
        }
    };

    function allDishes(){

        const lst = [];
        for(var i=0 ; i<Dishes.length ; i++){

            if((Dishes[i].DishName).toUpperCase().indexOf(searchDish.toUpperCase()) > -1){

                lst.push(
                    <Grid item xs={4} sm={4} key={Dishes[i].DishID}>
                        <Card variant="outlined">
                            <CardContent>
                                <Avatar 
                                    src={Dishes[i].ImageUrl}
                                    style={{
                                        width:'200px',
                                        height:'200px',
                                        border:"1px solid black"
                                    }} 
                                    variant='rounded'
                                    />
                                <Typography variant="h5" component="h2">
                                {Dishes[i].DishName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {Dishes[i].Description}
                                    <br></br>
                                    {Dishes[i].Category}
                                    <br></br>
                                    {Dishes[i].tags !== null && (Dishes[i].tags).join(",")}
                                </Typography>
                                <Typography variant="h6" component="h4">
                                    Rs {Dishes[i].Price}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <form onSubmit={(e)=>{onEditClick(e)}}>
                                <TextField onChange={()=>{}} style={{display:"none"}} name="DishName" value={Dishes[i].DishName}/>
                                <TextField onChange={()=>{}} style={{display:"none"}} name="Description" value={Dishes[i].Description}/>
                                <TextField onChange={()=>{}} style={{display:"none"}} name="Category" value={Dishes[i].Category}/>
                                <TextField onChange={()=>{}} style={{display:"none"}} name="Price" value={Dishes[i].Price}/>
                                <TextField onChange={()=>{}} style={{display:"none"}} name="DishID" value={Dishes[i].DishID}/>
                                <TextField onChange={()=>{}} style={{display:"none"}} name="ImageUrl" value={Dishes[i].ImageUrl}/>
                                <TextField onChange={()=>{}} style={{display:"none"}} name="OldFileName" value={Dishes[i].FileName}/>
                                <Button 
                                    startIcon={<EditIcon/>}
                                    type="submit" 
                                    variant="contained">Edit</Button>
                                </form>

                                <form onSubmit={(e)=>{onSubmitDelete(e)}}>
                                    <TextField 
                                    style={{display : "none"}} 
                                    name="DishID" 
                                    value={Dishes[i].DishID}
                                    onChange={()=>{}}
                                    />
                                    <TextField 
                                    style={{display : "none"}} 
                                    name="DeleteCategory" 
                                    value={Dishes[i].Category}
                                    onChange={()=>{}}
                                    />
                                    <TextField 
                                    style={{display : "none"}} 
                                    name="DishImageName" 
                                    value={Dishes[i].FileName}
                                    onChange={()=>{}}
                                    />
                                    <Button 
                                    startIcon={<DeleteIcon/>}
                                    type="submit" 
                                    color="secondary"
                                    variant="contained">Remove</Button>
                                </form>
                                
                                <form onSubmit={(e)=>{onSubmitStatus(e)}}>
                                    <TextField 
                                        style={{display : "none"}} 
                                        name="DishID" 
                                        value={Dishes[i].DishID}
                                        onChange={()=>{}}
                                    />
                                    <TextField 
                                        style={{display : "none"}} 
                                        name="Status" 
                                        value={Dishes[i].Available}
                                        onChange={()=>{}}
                                    />
                                    <Button startIcon={Dishes[i].Available ? <VisibilityIcon/> :<VisibilityOffIcon/>} type="submit">{Dishes[i].Available ? 'Available' : 'Unavailable' }</Button>
                                </form>
                            </CardActions>
                        </Card>
                    </Grid>
                );
            
            }
        }
        return(lst);
    }

    if(loading){
        return <LoadingScreen/>
    }else{
    return(
        <Box>
        
            {isMobile || isMobileDevice ? 
            
            <Box style={{marginLeft:"10px",marginRight:"10px"}}>

            <Grid container>
                <Grid item key='Dishes' sm={6} xs={6}>
                    <h3 className="mFont"> Dishes </h3>
                </Grid>
                <Grid item key='addDish' sm={6} xs={6}>
                    <Box textAlign="right">
                        <Button 
                            className="mFont yel"
                            startIcon={<AddIcon/>}
                            color="primary"
                            variant="contained" 
                            onClick={handleClick}
                            disableElevation> 
                            Add Dish
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Box>
                <TextField     
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                        style:{ height:40 } 
                    }}
                    onChange={handleSearch}
                    placeholder="Search by Dish Name..."
                    fullWidth
                />
            </Box>
            <Alert/>
            { Dishes.length <= 0 ?
            <Box style={{width:"100%",marginTop:40}}>
                <Typography style={{textAlign:"center"}}><NotInterestedIcon/></Typography>
                <Typography style={{textAlign:"center"}}>No Dish Added.</Typography>
            </Box>
            :
            <div style={{marginTop : "10px"}}>
                <div className="row">
                    {allDishes()}
                </div>
            </div>
            }
            </Box> 
            
            : 
            
            <Box>
            
            <Grid container>
                <Grid item key='Dishes2' sm={3} xs={3}>
                    <h3 className="mFont"> Dishes </h3>
                </Grid>
                <Grid item key='addDish2' sm={9} xs={9}>
                    <Box textAlign="right">
                        <Button 
                            className="mFont yel"
                            startIcon={<AddIcon/>}
                            color="primary"
                            variant="contained"
                            style={{marginRight:20}} 
                            onClick={handleClick}
                            disableElevation> 
                            Add Dish
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            
            <Divider style={{marginTop:10}}/>

            <Box style={{marginTop:10}}>
                <TextField     
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                        style:{ height:40 } 
                    }}
                    onChange={handleSearch}
                    placeholder="Search by Name"
                />
            </Box>

            <Alert/>
            { Dishes.length <= 0 ?
            <Box style={{width:"100%",marginTop:40}}>
                <Typography style={{textAlign:"center"}}><NotInterestedIcon/></Typography>
                <Typography style={{textAlign:"center"}}>No Dish Added.</Typography>
            </Box>
            :
            <div style={{marginTop : "20px"}}>
                <Grid container spacing={1}>
                    {allDishes()}
                </Grid>
            </div>
            }
           
            </Box>

            }

            <Dialog open={openAddDialog} onClose={handleClose}>
                <DialogTitle className="mFont">Add Dish</DialogTitle>
                <form onSubmit={(e)=>onSubmitForm(e)}>
                <DialogContent>
                    {DishPic ? 
                        <img src={DishPic} width="200px" height="200px" alt="unable to display." style={{border:"1px solid black"}}/>
                        :
                        <Box style={{width:200,height:200,border:"1px solid black"}}></Box>
                    }
                    <Box>
                        <input
                            name="myFile"
                            variant="outlined"
                            onChange={handleChangeDocuments}
                            className={classes.customFileInput}
                            type="file"
                            accept="image/*"
                        />
                    </Box>
                    <Box>
                        <TextField 
                            name="DishName"
                            variant="outlined"
                            type="text" 
                            className={classes.customInput}
                            onChange={e => onChange(e)} 
                            label="Dish Name"
                            fullWidth
                            required
                        />
                    </Box>
                    <Box>
                        <TextField 
                            name="Description"
                            type="text" 
                            variant="outlined"
                            className={classes.customInput}
                            onChange={e => onChange(e)} 
                            label="Dish Description"
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <Autocomplete
                            freeSolo
                            name="Category"
                            type="text" 
                            options={optionsCategory}
                            className={classes.customInput}
                            onInputChange={(event,newInputValue)=>{
                                setData({...formData,Category:newInputValue})
                            }}
                            renderInput={(params)=>
                            <TextField {...params} label="Category" variant="outlined" required/>}
                            fullWidth
                        />  
                    </Box>
                    <Box>
                        <TextField 
                            name="Price"
                            type="tel" 
                            className={classes.customInput}
                            onChange={e => onChange(e)} 
                            label="Price"
                            variant="outlined"
                            required
                            fullWidth
                        />
                    </Box>
                    
                    <Box>
                        <Grid container>
                            
                            {Tags.map(tag=>(
                                <Grid item key={tag} xs={6} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                            onChange={e => handleTags(e)}  
                                            color="primary" 
                                            name={tag} 
                                            checked={mtags.tag}/>
                                        }
                                        label={tag}                    
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}> Close </Button>
                    <Button type="submit" variant="contained" color="primary">Add Dish</Button>
                </DialogActions>
                </form>
            </Dialog>
            
            <Dialog open={openUpdateDialog} onClose={handleUpdateClose}>
                <DialogTitle className="mFont">Edit Dish</DialogTitle>
                <form onSubmit={(e)=>onSubmitUpdateForm(e)}>
                <DialogContent>
                    {updateDishPic === null ? 
                        <Box style={{width:200,height:200,border:"1px solid black"}}></Box>
                        :
                        <img src={updateDishPic} width="200px" height="200px" alt="unable to display." style={{border:"1px solid black"}}/>
                    }
                    <Box>
                        <input
                            name="myFile"
                            variant="outlined"
                            onChange={handleChangeUpdateDocuments}
                            className={classes.customFileInput}
                            type="file"
                            accept="image/*"
                        />
                    </Box>
                    <Box>
                        <TextField 
                            name="DishName"
                            type="text"
                            variant="outlined" 
                            className={classes.customInput}
                            onChange={e => onUpdateChange(e)} 
                            label="Dish Name"
                            value={editFormData.DishName}
                            required
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <TextField 
                            name="Description"
                            type="text" 
                            className={classes.customInput}
                            onChange={e => onUpdateChange(e)} 
                            label="Dish Description"
                            variant="outlined"
                            value={editFormData.Description}
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <Autocomplete
                            freeSolo
                            name="Category"
                            type="text" 
                            className={classes.customInput}
                            options={optionsCategory}
                            onInputChange={(event,newInputValue)=>{
                                setEditData({...editFormData,Category:newInputValue})
                            }}
                            value={editFormData.Category}
                            renderInput={(params)=><TextField {...params} variant="outlined" label="Category" required/>}
                            fullWidth
                        />
                        
                    </Box>
                    <Box>
                        <TextField 
                            name="Price"
                            type="tel" 
                            variant="outlined"
                            className={classes.customInput}
                            onChange={e => onUpdateChange(e)} 
                            label="Price"
                            value={editFormData.Price}
                            required
                            fullWidth
                        />
                    </Box>
                    <Box>
                        <Grid container>
                            {Tags.map(tag=>(
                            <Grid item key={`${tag}1`} xs={6} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                        onChange={e => handleUpdateTags(e)}  
                                        color="primary" 
                                        name={tag} 
                                        checked={utags.tag}/>
                                    }
                                    label={tag}                   
                                />
                            </Grid>
                            ))}
                            
                        </Grid>
                    </Box>
                    
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdateClose}> Close </Button>
                    <Button type="submit" variant="contained" color="primary">Update Dish</Button>
                </DialogActions>
                </form>
            </Dialog>
        
        </Box>
    );
    }
}

Dishes.propTypes={
    Dishes : PropTypes.array.isRequired,
    addDish : PropTypes.func.isRequired,
    deleteDish : PropTypes.func.isRequired,
    updateDish : PropTypes.func.isRequired,
    availableDish : PropTypes.func.isRequired,
    loadUser : PropTypes.func.isRequired,
    loading : PropTypes.bool.isRequired,
    setLoading : PropTypes.func.isRequired
};

const mapStateToProps = state =>({
    Dishes : state.auth.user.Dishes,
    Categories : state.auth.user.Categories,
    loading : state.loading
});

export default connect(mapStateToProps,{addDish,deleteDish,loadUser,updateDish,availableDish,setLoading})(Dishes);