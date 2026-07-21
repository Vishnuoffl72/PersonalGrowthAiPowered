import User from "../models/User.js";
import jwt from "jsonwebtoken"

const signToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"7d"});
}

export const register = async (req, res, next)=>{
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"name, email and password is/are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message:"password must be atleast 6 characters"});
        }
        const userExist = await User.findOne({email: email.toLowerCase()});
        if(userExist){
            return res.status(400).json({message:"Email already exist"});
        }
        const user = await User.create({
            name: name,
            email: email.toLowerCase(),
            password: password,
            avatar: name.charAt(0).toUpperCase()
        })
        const token = signToken(user._id);
        res.status(201).json({user,token})
    } catch (error) {
        console.log("source: register controller")
        res.status(500).json({message:error.message});
    }
}

export const login = async (req, res) =>{
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "email or password required" });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.matchPassword(password)) {
            return res.status(400).json({ message: "User or password not match" });
        }
        const token = signToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

export const me = (req,res)=>{
    return res.json({user: req.user});
}

export const update = async (req,res)=>{
    try {
        const { name, morningmotivation } = req.body;
        const user = await User.findById(req.user._id);
        if (name !== undefined) {
            user.name = name;
            user.avatar = name.charAt(0).toUpperCase();
        }
        if (morningmotivation !== undefined) {
            user.morningMotivation = morningmotivation;
        }
        await user.save();
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}