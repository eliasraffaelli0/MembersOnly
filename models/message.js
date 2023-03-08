const moongose = require('mongoose');
const { DateTime} = require('luxon')


const Schema = moongose.Schema;

const MessageSchema = new Schema({
    title: {type: String},
    text: {type: String},
    timestamp: {type: Date, default: Date.now},
    author: {type: Schema.Types.ObjectId, ref: "User"}
});

MessageSchema.virtual("formatted_date").get(function(){
    return DateTime.fromJSDate(this.timestamp).toFormat("HH:mm dd-MM-yyyy");
})

module.exports = moongose.model("Message", MessageSchema);