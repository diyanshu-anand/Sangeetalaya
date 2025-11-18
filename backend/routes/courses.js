import e from "express";
import authMiddleware from "../middleware/auth.js";
import {
    createCourse,
    getCourses,
    getCourseById,
    deleteCourse
} from "../controllers/courseControllers.js";

const router = e.Router();

router.post("/", authMiddleware, createCourse); //create
router.get("/", getCourses); // list all
router.get("/:id", getCourseById); // single
router.delete("/:id", authMiddleware, deleteCourse); //delete

export default router;