const moongose = require('mongoose');

const Schema = moongose.Schema;

const UserSchema = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String},
    password: {type: String},
    membership_status: {type: Boolean, default: false}
});

module.exports = moongose.model("User", UserSchema);