
const mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://localhost/blogdb';

const connectDB = async() =>{
await mongoose.connect(mongoDB, { useNewUrlParser: true });
console.log('MongoDB connected');
}

module.exports = {connectDB};
