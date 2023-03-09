const moongose = require('mongoose');

const Schema = moongose.Schema;

const UserSchema = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String},
    password: {type: String},
    membership_status: {type: Boolean, default: false},
    admin: {type: Boolean, default: false}
});

UserSchema.virtual("full_name").get(function(){
    let fullname = `${this.first_name} ${this.last_name}`;
    return fullname;
})

module.exports = moongose.model("User", UserSchema);