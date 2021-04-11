const express = require('express');
const connectDB = require('./config/db');
//const path = require("path");

const app = express();

//Connect to Database
connectDB();

//Initialize Middleware
app.use(express.json());
//app.use(express.static(path.join(__dirname, "/frontend/build")));

app.use('/api/users',require('./routes/api/users'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/dishes',require('./routes/api/dishes'));
app.use('/api/table',require('./routes/api/table'));
app.use('/api/history',require('./routes/api/history'));
app.use('/api/qr',require('./routes/api/qr'));
app.use('/api/help',require('./routes/api/help'));
app.use('/api/accounts',require('./routes/api/accounts'));
app.use('/api/employee',require('./routes/api/employees'));
app.use('/api/subscribe',require('./routes/api/subscribe'));
app.use('/api/feedback',require('./routes/api/feedback'));
app.use('/api/token',require('./routes/api/token'));
//app.get("/*", (req, res) => { res.sendFile(path.join(__dirname, "/frontend/build/index.html"));});

app.listen(process.env.PORT || 5000,function(){ 
    console.log('Server is up and Running on http://localhost:5000'); 
});
