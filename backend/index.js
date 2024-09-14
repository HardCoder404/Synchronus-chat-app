import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoute.js"
import contactRoutes from "./controllers/ContactController.js"
import setupSocket from "./socket.js"
import messagesRoute from "./routes/MessagesRoute.js"
import ChannelRoutes from "./routes/ChannelRoute.js"
import path from "path"

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

const _dirname = path.resolve();


// Implement Cors: 
const corsOptions = {
    origin: [process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
};
app.use(cors(corsOptions));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/contacts",contactRoutes);
app.use("/api/messages",messagesRoute);
app.use("/api/channel",ChannelRoutes);

app.use(express.static(path.join(_dirname,"/frontend/dist")));
app.get('*', (req,res)=>{
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is working fine!" });
});

// start server code: 
const server = app.listen(port,()=>{
    console.log(`Server is running at PORT ${port}`);
})

// socket call: 
setupSocket(server)
// Database connection code:
mongoose.connect(databaseURL)
.then(()=>console.log("DB connected"))
.catch(err=>console.log(err.message))