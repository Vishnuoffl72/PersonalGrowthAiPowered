import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";


export const getHabits = async (req, res) =>{
    try {
        const { includeArchieve} = req.query;
        const filter = { userId: req.user._id};
        if(includeArchieve !== "true") filter.isArchieve = false;
        const habits = await Habit.find(filter).sort({order:1, createdAt: 1});
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createHabit = async (req, res) =>{
    try {
        const {
            name,
            description,
            category,
            frequency,
            targetDays,
            colour,
            icon,
        } = req.body
        if(!name){
            return res.status(400).json({message:"name of habit is required"});
        }
        const count = await Habit.countDocuments({userId: req.user._id});
        const habit = await Habit.create({
            userId: req.user._id,
            name,
            description,
            category,
            frequency,
            targetDays,
            colour,
            icon,
            order: count,
        });
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updatehabit = async (req, res) =>{
    try {
        const habit = await Habit.findOne({
            _id : req.params.id,
            userId: req.user._id
        });
        if(!habit){
            return res.status(400).json({message:"habit not found"});
        }
        const fields = [
            "name",
            "description",
            "category",
            "frequency",
            "targetDays",
            "colour",
            "icon",
            "order"
        ];
        for(const f of fields){
            if(req.body[f] !== undefined){
                habit[f] = req.body[f];
            }
        }
        await habit.save();
        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const deleteHabit = async (req, res)=>{
    try {
        const habit = await Habit.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if(!habit){
            return res.status(400).json({message:"habit not found"});
        }
        const habitLog = await HabitLog.deleteMany({habitId: req.id, userId: req.user._id});
        res.status(200).json({message:"Habit deleted"})
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const archieveHabit = async (req, res)=>{
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if(!habit){
            return res.status(400).json({message:"habit not found"});
        }
        habit.isArchieve = !habit.isArchieve;
        await habit.save();
        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const reorderHabits = async (req, res)=>{
    try {
        const { order } = req.body;
        if(!Array.isArray(order)){
            return res.status(400).json({message:"order must be array"});
        }
        await Promise.all(
            order.map((id, idx)=>{
                Habit.updateOne(
                    {_id:id, userId: req.user._id},
                    { $set:{order: idx}}
                )
            })
        );
        res.status(200).json({message:"Reordered"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}