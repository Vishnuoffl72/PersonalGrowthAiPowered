import express from "express";
import { protect } from "../middleware/auth.js";
import { archieveHabit, createHabit, deleteHabit, getHabits, reorderHabits, updatehabit } from "../controllers/habbitController.js";

const router = express.Router();


router.use(protect);

router.get('/',getHabits);
router.post('/',createHabit);
router.put('/:id',updatehabit);
router.delete('/:id',deleteHabit);
router.put('/archieve/:id', archieveHabit);
router.put('/reorder',reorderHabits);

export default router;
