import express from "express";
import {
  isUniqueKeyCombinationNotExist,
  register,
  registerCombination,
} from "./controller/teacherController.js";
import {
  getCommonStudent,
  suspendStudent,
} from "./controller/studentController.js";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/api/register", async (req, res) => {
  // Extract data from the request body
  const { teacher, students } = req.body;

  try {
    // Register the params
    await register(teacher, students);

    for (const studentEmail of students) {
      const combinationNotExist = await isUniqueKeyCombinationNotExist(
        teacher,
        studentEmail
      );
      console.log({ combinationNotExist });

      if (combinationNotExist) {
        await registerCombination(teacher, studentEmail);
      }
    }

    // Send a success response
    res.status(204).send();
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
});

app.get("/api/commonstudents", async (req, res) => {
  const teacherEmails = req.query.teacher;

  const teachers = Array.isArray(teacherEmails)
    ? teacherEmails
    : [teacherEmails];

  const params = [...teachers];
  const commonStudents = await getCommonStudent(params);
  const formatStudents = commonStudents.map((student) => student.email);
  res.status(200).json({ students: formatStudents });
});

app.post("/api/suspend", async (req, res) => {
  try {
    const { student } = req.body;

    if (!student) {
      return res
        .status(400)
        .json({ message: "Provide a student email address" });
    }
    const params = [student];

    await suspendStudent(params);
    return res.status(204).json({message: "Student suspended successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
