import db from "../services/config.js";

//Query
const INSERT_TEACHER = "INSERT IGNORE INTO teachers (email) VALUES (?)";
const INSERT_STUDENT = "INSERT IGNORE INTO students (email) VALUES (?)";
export const SELECT_TEACHER_ID = "SELECT id FROM teachers WHERE email = ?";
export const SELECT_STUDENT_ID = "SELECT id FROM students WHERE email = ?";
const INSERT_TEACHER_STUDENT =
  "INSERT INTO teacher_student (teacher_id, student_id) VALUES (?, ?)";
const SELECT_TEACHER_STUDENT =
  "SELECT * FROM teacher_student WHERE teacher_id = ? AND student_id = ?";

async function insertIfNotExists(query, selectQuery, params) {
  const connection = await db.getConnection();
  try {
    const [existingRow] = await connection.execute(selectQuery, params);

    if (existingRow.length === 0) {
      const [result] = await connection.execute(query, params);
      return result;
    } else {
      return null;
    }
  } finally {
    connection.release();
  }
}

export async function register(teacherEmail, studentEmails) {
  const connection = await db.getConnection();
  try {
    console.log("Database connected successfully");
    // Start a database transaction
    await connection.beginTransaction();
    console.log("Database transaction begins");

    await insertIfNotExists(INSERT_TEACHER, SELECT_TEACHER_ID, [teacherEmail]);

    for (const studentEmail of studentEmails) {
      await insertIfNotExists(INSERT_STUDENT, SELECT_STUDENT_ID, [
        studentEmail,
      ]);
    }

    //Commit query changes
    await connection.commit();
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

export async function isUniqueKeyCombinationNotExist(
  teacherEmail,
  studentEmail
) {
  const connection = await db.getConnection();
  try {
    const [studentResult] = await connection.execute(SELECT_STUDENT_ID, [
      studentEmail,
    ]);

    const studentId = studentResult[0].id;

    const [teacherResult] = await connection.execute(SELECT_TEACHER_ID, [
      teacherEmail,
    ]);

    const teacherId = teacherResult[0].id;

    const [rows] = await connection.execute(SELECT_TEACHER_STUDENT, [
      teacherId,
      studentId,
    ]);

    if (rows.length > 0) {
      return false;
    } else {
      return true;
    }
  } finally {
    connection.release();
  }
}

export async function registerCombination(teacherEmail, studentEmail) {
  const connection = await db.getConnection();
  try {
    console.log("Database connected successfully");
    // Start a database transaction
    await connection.beginTransaction();
    console.log("Database transaction begins");

    const [studentResult] = await connection.execute(SELECT_STUDENT_ID, [
      studentEmail,
    ]);

    const studentId = studentResult[0].id;

    const [teacherResult] = await connection.execute(SELECT_TEACHER_ID, [
      teacherEmail,
    ]);

    const teacherId = teacherResult[0].id;

    // Create the connection between student and teacher
    await connection.execute(INSERT_TEACHER_STUDENT, [teacherId, studentId]);

    //Commit query changes
    await connection.commit();
  } catch (error) {
    console.log({ error });
    if (connection) {
      await connection.rollback();
    }
    throw error;
  }
}
