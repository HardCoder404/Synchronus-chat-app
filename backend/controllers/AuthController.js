import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import {renameSync,unlinkSync} from "fs"
// creating JWT TOKENS 
const maxAge = 3*24*60*60*1000;  // means 3days

const createToken = (email,userId) =>{
    return jwt.sign({email,userId}, process.env.JWT_KEY, {expiresIn:maxAge});
}


export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "Email and Password are required" });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ error: "EmailAlreadyExists" });
    }

    // Create user in the database
    const user = await User.create({ email, password });

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      }
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).json({ error: "InternalServerError" });
  }
};



export const login = async (request, response, next) => {
  try { 
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "Email and Password are required" });
    }

    // Check if user is present in the database
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ error: "UserNotFound" });
    }

    // Check if password matches
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(400).json({ error: "IncorrectPassword" });
    }

    // If authentication is successful
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      }
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).json({ error: "InternalServerError" });
  }
};


export const getUserInfo = async (request,response,next) =>{
    try {
      const userData = await User.findById(request.userId);
      if(!userData){
        return response.status(404).send("User with this ID not found");
      }      

      return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
      })
    } catch (error) {
      console.log({error});
      return response.status(500).send("Internal Server ERROR")
    }
}

export const updateProfile = async (request,response,next) =>{
    try {
      const {userId} = request;
      const {firstName,lastName,color} = request.body;
      
      if(!firstName || !lastName){
        return response.status(400).send("FirstName LastName is required");
      }      

      const userData = await User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          color,
          profileSetup:true,
        },
        { new:true, runValidators:true}
      );
      return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
      })
    } catch (error) {
      console.log({error});
      return response.status(500).send("Internal Server ERROR")
    }
}


export const addProfileImage = async (request,response,next) =>{
    try {
      if(!request.file){
        return response.status(400).send("File is required");
      }
      const date = Date.now();
      let fileName = "uploads/profiles/" + date + request.file.originalname;
      renameSync(request.file.path, fileName);

      const updatedUser = await User.findByIdAndUpdate(
        request.userId,
        {image: fileName},
        {new:true, runValidators:true}
      )
      return response.status(200).json({
            image: updatedUser.image,
      })
    } catch (error) {
      console.log({error});
      return response.status(500).send("Internal Server ERROR")
    }
}
export const removeProfileImage = async (request,response,next) =>{
    try {
      const {userId} = request;
      const user = await User.findById(userId);
    
      if(!user){
        return response.status(404).send("User not found");
      }

      if(user.image){
        unlinkSync(user.image)
      }
      user.image = null;
      await user.save();

      return response.status(200).send("Profile Image removed Successfully")
    } catch (error) {
      console.log({error});
      return response.status(500).send("Internal Server ERROR")
    }
}


export const logout = async (request,response,next) =>{
    try {
     response.cookie("jwt","", {maxAge:1 , secure:true, sameSite:"None"})

      return response.status(200).send("Logout Successfull")
    } catch (error) {
      console.log({error});
      return response.status(500).send("Internal Server ERROR")
    }
}


