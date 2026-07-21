import mongoose from "mongoose"

const CATEGORIES = [
    "Health",
    "Fitness",
    "Learning",
    "Mindfullness",
    "Productivity",
    "Social",
    "Finance",
    "Creative",
    "Other",
];

const habitSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:"User", required: true, index: true},
    name:{type: String, required: true, trim: true},
    description: {type: String, default:"",trim: true},
    category:{type:String, enum:CATEGORIES,default:"Others"},
    frequency:{type:String,enum:["daily","weekly"],default:"daily"},
    targetDays:{type: Number,default:7,min: 1, max: 7},
    colour:{type:String,default:"#6366F1"},
    icon:{type:String,default:":->"},
    isArchieve:{type:Boolean,default:false},
    order:{type:Number,default:0}
},{
    timestamps:true
});

export const HABIT_CATEGORIES = CATEGORIES;
export default mongoose.model("Habit", habitSchema);