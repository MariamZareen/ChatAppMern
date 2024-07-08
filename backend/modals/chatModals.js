const mongoose = require('mongoose')

const chatModel = mongoose.Schema({
    chatName:String,
    isGroupChat: Boolean,
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}
,
{
    timeStamp: true,
}
)

const Chat = mongoose.model('Chat',chatModel)
module.exports = Chat;