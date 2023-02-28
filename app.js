const express = require('express');
const app = express(); //spin up an express app

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


//import api/routes files 
const usersRoutes = require('./api/routes/users');
const paymentsRoutes = require('./api/routes/payments');

const foodItemRoutes = require('./api/routes/foodItems');
const categoryRoutes = require('./api/routes/category');
const menuRoutes = require('./api/routes/menu');

const packagesRoutes = require('./api/routes/packages');
const typesRoutes = require('./api/routes/types');
const subscriptionsRoutes = require('./api/routes/subscriptions');

const ordersRoutes = require('./api/routes/orders');

const discountsRoutes = require('./api/routes/discounts');

const eventsRoutes = require('./api/routes/events');


//connect to database
mongoose.connect(
    "mongodb+srv://user1:" + process.env.MONGO_ATLAS_PW + "@cluster0.moyx33t.mongodb.net/?retryWrites=true&w=majority"
);


//Middlewares
app.use(morgan('dev')); //logger
app.use(bodyParser.urlencoded({ extended: false })); //extract url data
app.use(bodyParser.json()); //extract json and make it readable


//Prevent CORS errors
//Append header to responses - allow access from diff servers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


//Routes - to handle requests
app.use('/users', usersRoutes);
app.use('/payments', paymentsRoutes);

app.use('/foodItems', foodItemRoutes);
app.use('/category', categoryRoutes);
app.use('/menu', menuRoutes);

app.use('/packages', packagesRoutes);
app.use('/types', typesRoutes);
app.use('/subscriptions', subscriptionsRoutes);

app.use('/orders', ordersRoutes);

app.use('/discounts', discountsRoutes);
app.use('/events', eventsRoutes);


//catch errors - things that weren't managed above (page not found)
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//catch other errors
app.use((req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;