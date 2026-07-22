import Habit from "../models/Habit";
import HabitLog from "../models/HabitLog";
import { last90Days, todayKey } from "../utils/dateHelpers";



export const markComplete = async (req, res) => {
    try {
        const { habitId, date }= req.body;
        const completedDate = date || todayKey();
        const habit = await Habit.findOne({
            _id: habitId,
            userId: req.user._id
        });
        if(!habit){
            return res.status(400).json({message:"Habit not found"});
        };
        const newLog = await HabitLog.findOneAndUpdate({
            userId: req.user_id, habitId, completedDate
        },{
            $setOnInsert:{userId: req.user_id, habitId, completedDate}
        },{
            upsert: true, new: true
        });
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const unmarkComplete = async (req, res) => {
    try {
        const { habitId, date} = req.body;
        const completedDate = date || todayKey();
        const habit = await Habit.findOne({
            _id: habitId,
            userId: req.user._id
        });
        if(!habit){
            return res.status(400).json({message:"Habit not found"});
        };
        await HabitLog.findOneAndDelete({
            userId: req.user._id,
            habitId,
            completedDate
        });
        res.status(200).json({message:"unmarked habit"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getLogRange = async (req, res) => {
    try {
        const { start, end} = req.body;
        const habitLog = await HabitLog.find({
            userId: req.user._id,
            completedDate: { $gte: start, $lte: end}
        });
        res.status(200).json(habitLog);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getTodayLogs = async (req, res) =>{
    try {
        const todayLog = await HabitLog.find({
            userId: req.user._id,
            completedDate:  todayKey()
        })
        res.status(200).json(todayLog);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getHeatMap = async (req, res) =>{
    try {
        const days = last90Days();
        const habitLog = await HabitLog.find({
            userId: req.user._id,
            completedDate: { $gte: days[0], $lte: days[days.length -1]}
        });
        const counts = {};
        for(const d in days) counts[d] = 0;
        for(const l in habitLog) counts[l.completedDate] = (counts[l.completedDate] || 0) + 1 ;
        const result = days.map((d) => ({date:d , count: counts[d]||0}));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getHabitStats = async (req, res) =>{
    try {
        res.status(200).json({message:"TBD"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getAllStats = async (req, res)=>{
    try {
        res.status(200).json({message:"TBD"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}