const mongoose = require('mongoose');

const dbconnection = async () => {
    try {
        await mongoose.connect("mongodb+srv://elvinhumura:ozFRLj65PJ6dmwzo@cluster0.huok3f1.mongodb.net/notes-app-db?retryWrites=true&w=majority&appName=Cluster0");
        console.log('Connected to mongodb successfully');
    } catch (error) {
        console.log(error);
    }
}


module.exports = dbconnection;
