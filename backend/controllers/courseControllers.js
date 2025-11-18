import Course from "../models/Course.js"

// Create a new course 
export const createCourse = async (req, res) => {
    try{
        const { title, description, category, lessons, price, thumbnail } = req.body;

        const course = new Course({
            title,
            description,
            category,
            lessons,
            price,
            thumbnail,
            createdBy: req.user.id,
        });

        await course.save();
        res.status(201).json({ message: "Course created successfully", course});
    }catch (error){
        console.error(error);
        res.status(500).json({ error: "Server Error while creating more course"});
    }
};

// Get all Courses
export const getCourses = async (req, res) => {
    try{
        const courses = await Course.find().populate("createdBy", "name email");
        res.status(200).json(courses);

    }catch (error) {
        res.status(500).json({ error:"Failed to fetch courses"});
    }
}

// Nevere sended a succesfull response in it that's why stuck over here 
// //Get Single Courses
// export const getCourseById = async (req,res) => {
//     try{
//         const course = await Course.findById(req.params.id).populate("createdBy", "name email");
//         if (!course) return res.status(404).json({ error:"Course not found"});
//     }catch(error){
//         res.status(500).json({error: "Error retriving course"});
//     }
// }


// GET course by ID
export const getCourseById = async (req, res) => {
  console.log("🔍 Incoming request for course ID:", req.params.id);
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      console.log("⚠️ No course found for ID:", req.params.id);
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("✅ Course found:", course.title);
    res.status(200).json(course);
  } catch (err) {
    console.error("❌ Error fetching course by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};
//Delete Course (optional)
export const deleteCourse = async (req, res) => {
    try{
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error:"Course not found"});
        if (course.createdBy.toString() !== req.user.id)
            return res.status(403).json({ error:"Unauthorized action"})

        await course.deleteOne();
        res.status(200).json({ message: "Course deleted succcessfully"});
    }catch(error){
        res.status(500).json({ error: "Error deleting course"});
    }
};