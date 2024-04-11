const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dbconnection = require('./utils/dbcon');
require('dotenv').config();
const bodyParser = require('body-parser');
const Notes = require('./models/notes-model');

const app = express();

const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes)
app.use(notFound);
app.use(errorHandler);

dbconnection();



const port = process.env.PORT || 1000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
