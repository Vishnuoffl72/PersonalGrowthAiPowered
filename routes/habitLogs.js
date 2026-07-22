import express from 'express'
import { protect } from '../middleware/auth';
import { getAllStats, getHabitStats, getHeatMap, getLogRange, getTodayLogs, markComplete, unmarkComplete } from '../controllers/logController';

const router = express.Router();


router.use(protect);

router.put('/markComplete',markComplete);
router.put('/unmarkComplete', unmarkComplete);
router.get('/logRange',getLogRange);
router.get('/todayLogs',getTodayLogs);
router.get('/heatMap',getHeatMap);
router.get('/habitStats',getHabitStats);
router.get('/allStats',getAllStats);

export default router