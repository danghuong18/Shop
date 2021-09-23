const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb://localhost:27017/ShopDatabase`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("MongoDb connected!"))
.catch(err => console.log(err));

module.exports = mongoose;
