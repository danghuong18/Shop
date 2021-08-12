const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(``,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

module.exports = mongoose;