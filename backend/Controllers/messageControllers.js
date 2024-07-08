const expressAsyncHandler = require('express-async-handler')
const Message = require("../modals/messageModel")
const User = require("../modals/userModels")
const Chat = require("../modals/chatModals");


const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("receiver")  // Ensure the field name is correct
      .populate("chat");

    // console.log("called all messages");
    // console.log(messages);
    res.json(messages);
  } catch (error) {  // Added error parameter
    console.log("error in all messages function", error);  // Log the error details
    res.status(400).send("error in all messages");
  }
});



// const sendMessages = expressAsyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;
//   if (!content || !chatId) {
//       return res.sendStatus(400);
//   }

//   const newMessage = {
//       sender: req.user._id,
//       content: content,
//       chat: chatId
//   };

//   try {
//       let message = await Message.create(newMessage);
//       message = await message.populate("sender", "name").execPopulate();
//       message = await message.populate("chat").execPopulate();
//       message = await message.populate("receiver").execPopulate();
//       message = await User.populate(message, {
//           path: "chat.users",
//           select: "name email"
//       });
//       await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
//       res.json(message);
//   } catch (error) {
//       console.error("Error in send message function:", error);
//       res.status(500).json({ error: "An error occurred while sending the message." });
//   }
// });


// const sendMessages = expressAsyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;
//   if (!content || !chatId) {
//       return res.sendStatus(400);
//   }

//   const newMessage = {
//       sender: req.user._id,
//       content: content,
//       chat: chatId
//   };

//   try {
//       let message = await Message.create(newMessage);
//       // Ensure that message is an instance of the Mongoose model after creation
//       if (!(message instanceof Message)) {
//           throw new Error("Message object is not an instance of the Mongoose model.");
//       }

//       // Populate sender field
//       await message.populate("sender", "name").execPopulate();

//       // Populate chat field
//       await message.populate("chat").execPopulate();

//       // Assuming receiver is a field in the message schema, populate it
//       // Replace "receiver" with the actual field name if different
//       await message.populate("receiver").execPopulate();

//       // Assuming User is another Mongoose model and "chat.users" is a field to populate
//       // Replace "User" with the actual model name if different
//       message = await User.populate(message, {
//           path: "chat.users",
//           select: "name email"
//       });

//       // Update latestMessage in Chat model
//       await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

//       console.log(message);
//       res.json(message);
//   } catch (error) {
//       console.error("Error in send message function:", error);
//       res.status(500).json({ error: "An error occurred while sending the message." });
//   }
// });

const sendMessages = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId
  };

  try {
    const message = await Message.create(newMessage);

    // Ensure message is a Mongoose model instance
    if (!message.constructor.modelName === 'Message') { // Use modelName property
      throw new Error("Message object is not an instance of the Mongoose model.");
    }

    // Chain population calls
    //await message.populate('sender', 'name').populate('chat').populate('receiver');  
    

    // Update Chat model with populated users
    const populatedChat = await Chat.findByIdAndUpdate(
      req.body.chatId,
      { latestMessage: message },
      { new: true } // Return the updated document
    )
    //.populate('users', 'name email'); // Populate users within Chat

    //console.log(populatedChat);
    res.json(populatedChat);
    
  } catch (error) {
    console.error("Error in send message function:", error);
    res.status(500).json({ error: "An error occurred while sending the message." });
  }
});


module.exports = sendMessages;


module.exports = { allMessages, sendMessages}


