const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');

dotenv.config();
app.use(cors())
app.use(express.json())
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected");
  } catch (error) {
    console.error("Failed to connect to db:", error);
  }
};
connectDb();

app.get("/", (req, res) => {
  res.send("Welcome");
  console.log("Welcome");
});

app.use('/user', userRoutes);
app.use('/chat', chatRoutes)
app.use('/message', messageRoutes)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log("server is running "))

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000
})

io.on ("connection", (socket)=>{
  // console.log("socket.io Connection established")
  socket.on("setup", (user) =>{
  //   socket.join(user.data._id)
    socket.emit("connected");
  })
  
  socket.on("join chat", (room)=>{
    socket.join(room);
    
  })
  

  socket.on("new message", (newMessageStatus)=>{
    var chat = newMessageStatus.chat;
    if(!chat.users){
      return console.log("chat.users not defined")
    }
    chat.users.forEach((user)=>{
      if(user._id == newMessageStatus.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    })
  })
})

// app.listen(PORT, () => {
//   console.log("App listening on port", PORT);
// });


