const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:3000" });


let onlineUsers = []


io.on("connection", (socket) => {

  socket.on("addNewUser",(userId)=>
  {
    !onlineUsers.some((x)=> x.userId === userId && userId!=null) && onlineUsers.push({userId,socketId : socket.id});
    console.log("Online User added",onlineUsers.length);
    io.emit("onlineUsers",onlineUsers);
  })
 

  // adding messages

  socket.on("sendMessage",(message)=>
  {
    const user = onlineUsers.find(user => user.userId === message.recipientId)
    
    if(user)
    {

      //notificaton
      io.to(user.socketId).emit('getNotification',{
        senderId: message.senderId,
        isRead: false,
        date: new Date()
      });

      io.to(user.socketId).emit('getMessage',message);
      // Notification on User
      console.log("senderMessage",message.senderId)
      
    }

  })


  socket.on("disconnect",()=>
  {
    onlineUsers.filter((user) => user.socketId !== socket.id)
    console.log("online people",onlineUsers.length)
    io.emit("onlineUsers",onlineUsers);
  })
});

io.listen(4000);