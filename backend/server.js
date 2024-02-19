const express = require('express')
const dotenv = require('dotenv')
const app = express()
dotenv.config()
const cors = require('cors');
const { connectDB } = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { errorHandler, notFound} = require('./middleware/errorMiddleware') 


connectDB()
app.use(cors());
app.use(express.json())

const PORT = process.env.PORT || 4000
console.log(process.env.PORT)
app.get("/",(req,res)=>{
    res.send("yo")
})


app.get("/api/chat/:id",(req,res)=>{
    const singleChat = chats.find((c)=> c._id === req.params.id)
    res.send(singleChat)
})

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT,console.log(`server started on ${PORT}`))

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors: {
        origin: process.env.URL
    }
})

io.on("connection",(socket) => {
    console.log("connected to socket.io")

    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('connected')
    })

    socket.on('join chat',(room)=>{
        socket.join(room)
        console.log("User joined Room: " + room)
    })

    socket.on('typing',(room)=> socket.in(room).emit("typing"))
    socket.on('stop typing',(room)=> socket.in(room).emit("stop typing"))

    socket.on('new message',(newMessgeReceived)=>{
        let chat = newMessgeReceived.chat;
        if(!chat.users) return console.log("chat.users in not defined");

        chat.users.forEach(user => {
            if( user._id == newMessgeReceived.sender._id) return ;

            socket.in(user._id).emit("message received", newMessgeReceived)
        })
    })

    socket.off("setup",()=>{
        console.log("USER DISSCONNECTED");
        socket.leave(userData._id);
    })
})