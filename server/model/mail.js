const mongoose = require('mongoose');

const mailSchema = mongoose.Schema({
    email: String,
    createdDate: Date,
}, {
    versionKey: false
});

module.exports = mongoose.model('Mail', mailSchema);