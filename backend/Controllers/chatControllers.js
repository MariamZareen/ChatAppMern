const expressAsyncHandler = require("express-async-handler")
const Chat = require('../modals/chatModals')
const User = require('../modals/userModels')

const accessChat = expressAsyncHandler(async (req, res) => {
    //console.log('access chat called')
    try {
      const { userId } = req.body;
  
      if (!userId) {
        console.log("UserId param not sent with request");
        return res.status(400).send("UserId parameter is required");
      }
  
      var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } }
        ]
      })
        .populate("users", "-password")
        .populate("latestMessage");
  
      isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email"
      });
  
      if (isChat.length > 0) {
        res.send(isChat[0]);
      } else {
        var chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [req.user._id, userId]
        };
  
        const createdChat = await Chat.create(chatData);
  
        const fullChat = await Chat.findOne({ _id: createdChat._id })
          .populate("users", "-password")
          .populate("latestMessage");
        
        console.log(fullChat);
        res.status(200).send(fullChat);
      }
    } catch (e) {
      console.log("error in access chat", e);
      res.status(400).send("Error occurred in access chat");
    }
  });
  

const fetchChats = expressAsyncHandler(async(req,res) =>{

    try{
        Chat.find({ users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async (results)=>{
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name email"
            })
            res.status(200).send(results)
        })
    }
    catch(e){
        console.log("error in fetch chats")
       res.status(400).send("error in fetch Chats")
    }

})

const fetchGroups = expressAsyncHandler(async(req,res) =>{

    try{
        const allGroups = await Chat.where("isGroupChat").equals(true);
        res.status(200).send(allGroups)
    }
    catch(e){
        res.status(400).send("error in fetch groups")
    }
})

const createGroupChat = async (req, res) => {
  try {
    // Validate presence of required data
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: "Insufficient data" });
    }

    // Parse users data
    console.log(req.body.users)
    let users;
    try {
      users = req.body.users;
    } catch (error) {
      console.error("Error parsing users JSON:", error);
      return res.status(400).json({ message: "Invalid users JSON format" });
    }

    // Add current user to the group
    // users.push(req.user);

    // Create the group chat
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users:users,
      isGroupChat: true,
      groupAdmin: users[0],
    });

    // Populate users and groupAdmin with limited fields
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error("Error in createGroupChat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const groupExit = expressAsyncHandler(async(req,res) =>{
    const { chatId, userId } =req.body
    const removed = await Chat.findOneAndUpdate(
        { _id: chatId, users: userId }, 
        { $pull: { users: userId } }, 
        { new: true } 
      )
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if(!removed){
        res.status(404).send("Chat not found");
    }else{
        res.json(removed)
    }
})

const addSelfToGroup= expressAsyncHandler(async(req,res)=>{
    const { chatId, userId} = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId, {
          $push: {users: userId},
      },
      {
        new: true
      }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added){
        console.log("Chat not found in add self function");
        res.status(404).send("Chat not found")
    }
    else{
        res.status(200).json(added)
    }
  })

module.exports = {accessChat, fetchChats, fetchGroups, createGroupChat, groupExit, addSelfToGroup} 