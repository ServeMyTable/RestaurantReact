const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');
const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const uuid = require('uuid');
const path = require('path');

const multer = Multer({
    storage: Multer.MemoryStorage
});
const storage = new Storage({
    projectId : 'serve-my-table',
    keyFilename : './key.json'
});
const bucketName = 'restaurant-documents';
const bucket = storage.bucket(bucketName);

//@route    POST api/dishes/
//@desc     Add dishes
//@access   Private

router.post('/',
    [ auth ,multer.single("myFile")], 
    async (req,res)=>{
       
    try{
        const errors1 = [];

        if(req.file){
            const gcsFileName = uuid.v1()+path.extname(req.file.originalname);
            const file = bucket.file(gcsFileName);

            const stream = file.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            stream.on('error', (err) => {
                req.file.cloudStorageError = err;
                errors1.push(err);
                res.status(500).send("Server Error");
            });

            stream.on('finish', async () => { 
                req.file.cloudStorageObject = gcsFileName;
                try{
                    const object0 = await file.makePublic();
                    req.files[0].gcsUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
                    return object0;
                }catch(err){
                    errors1.push(err);
                    console.log("Error while uploading Image");
                }
            });
            
            stream.end(req.file.buffer);

            if(errors1.length <= 0){
                
                const Dish = {
                    DishID : uuid.v4(), 
                    DishName : req.body.DishName,
                    Description : req.body.Description,
                    Price : req.body.Price,
                    tags : req.body.tags,
                    Category : req.body.Category,
                    ImageUrl : `https://storage.googleapis.com/${bucketName}/${gcsFileName}`,
                    FileName : gcsFileName
                };
                const user = await User.findOneAndUpdate({_id : req.user.id},{$push:{'Dishes' : Dish,'Categories' : Dish.Category}}).select('-password');;
                
                res.status(200).send(user);

            }else{
                console.log(errors1);
                res.status(500).send('Server Error');
            }

            
        }else{
            const Dish = {
                DishID : uuid.v4(), 
                DishName : req.body.DishName,
                Description : req.body.Description,
                Price : req.body.Price,
                tags : req.body.tags,
                Category : req.body.Category,
            };
            const user = await User.findOneAndUpdate({_id : req.user.id},{$push:{'Dishes' : Dish,'Categories' : Dish.Category}}).select('-password');;
            res.status(200).send(user);
        }

    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
    
});

//@route    POST api/dishes/update
//@desc     update dishes
//@access   Private
router.post('/update',
    [ auth ,multer.single("myFile") ], async (req,res)=>{
        
        try{
            const errors1 = [];
            if(req.file){
                const gcsFileName = uuid.v1()+path.extname(req.file.originalname);
                const file = bucket.file(gcsFileName);

                const stream = file.createWriteStream({
                    metadata: {
                        contentType: req.file.mimetype,
                    },
                });

                stream.on('error', (err) => {
                    req.file.cloudStorageError = err;
                    errors1.push(err);
                    res.status(500).send("Server Error");
                });

                stream.on('finish', async () => { 
                    req.file.cloudStorageObject = gcsFileName;
                    try{
                        const object0 = await file.makePublic();
                        req.files[0].gcsUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
                        return object0;
                    }catch(err){
                        errors1.push(err);
                        console.log("Error while uploading Image");
                    }
                });
                
                stream.end(req.file.buffer);

                if(errors1.length <= 0){
                    if(req.body.OldFileName)
                        bucket.file(req.body.OldFileName).delete();

                    const Dish = {
                        DishID : uuid.v4(), 
                        DishName : req.body.DishName,
                        Description : req.body.Description,
                        Price : req.body.Price,
                        tags : req.body.tags,
                        Category : req.body.Category,
                        ImageUrl : `https://storage.googleapis.com/${bucketName}/${gcsFileName}`,
                        FileName : gcsFileName
                    };
                    
                    await User.updateOne({_id : req.user.id,'Dishes.DishID' : req.body.DishID},
                    {$set:{
                        'Dishes.$.DishName' : Dish.DishName,
                        'Dishes.$.Description' : Dish.Description,
                        'Dishes.$.Price':Dish.Price,
                        'Dishes.$.tags':Dish.tags,
                        'Dishes.$.Category':Dish.Category,
                        'Dishes.$.ImageUrl': Dish.ImageUrl,
                        'Dishes.$.FileName':Dish.FileName
                    }});

                    await User.updateOne({_id : req.user.id},{$push : {'Categories':Dish.Category}});

                    res.status(200).send('Dish Updated Successfully');
                }
                else{
                    console.log(errors1);
                    res.status(500).send("Server Error");
                } 
            }else{
                const Dish = {
                    DishName : req.body.DishName,
                    Description : req.body.Description,
                    Price : req.body.Price,
                    tags : req.body.tags,
                    Category : req.body.Category
                };
    
                await User.updateOne({_id : req.user.id,'Dishes.DishID' : req.body.DishID},
                {$set:{
                    'Dishes.$.DishName' : Dish.DishName,
                    'Dishes.$.Description' : Dish.Description,
                    'Dishes.$.Price':Dish.Price,
                    'Dishes.$.tags':Dish.tags,
                    'Dishes.$.Category':Dish.Category
                }});
    
                await User.updateOne({_id : req.user.id},{$push : {'Categories':Dish.Category}});
                
                res.status(200).send('Dish Updated Successfully');
            }
                    
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});

//@route    POST api/dishes/delete
//@desc     Add dishes
//@access   Private
router.post('/delete',auth, async (req,res)=>{

    try{
    
        const user = await User.findOne({_id : req.user.id});
        var Categories = user.Categories;
        var DeleteCategory = req.body.DeleteCategory;
        var index = Categories.indexOf(DeleteCategory);
        Categories.splice(index,1);
        var DishImageName = req.body.DishImageName;
        if(DishImageName){
            bucket.file(DishImageName).delete();
        }

        const response = await User.updateOne({_id: req.user.id},{
                $pull : {
                    Dishes : {DishID : req.body.DishID},
                },
                $set : {
                    Categories : Categories
                }
        });
        
        
        res.status(200).send("Dish Deleted Successfully");
      
    }catch(err){
        console.log(err);
        res.status(500).send('Server Error');
    }
});

//@route    POST api/dishes/available
//@desc     Dish Availability
//@access   Private
router.post('/available',[ auth ,check('Status','Status is invalid').isBoolean() ]
    , async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array() });
        }
        try{
        var changeStatus = req.body.Status;
        if(req.body.Status == "true"){
            changeStatus = "false";
        }else{
            changeStatus = "true";
        }

        await User.updateMany({_id:req.user.id,'Dishes.DishID' : req.body.DishID},
        {$set:{'Dishes.$.Available' : changeStatus}});
               
        res.status(200).json("Dish Availability changed");
            
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    
});

module.exports = router;