import { Router } from "express";
import { CreateChannel, getChannelMessages, getUserChannels } from "../controllers/ChannelController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";


const ChannelRoutes = Router();

ChannelRoutes.post("/create-channel",verifyToken,CreateChannel);
ChannelRoutes.get("/get-user-channels",verifyToken,getUserChannels);
ChannelRoutes.get("/get-channel-messages/:channelId",verifyToken,getChannelMessages);

export default ChannelRoutes;