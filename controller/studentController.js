import db from "../services/config.js";
import { SELECT_STUDENT_ID } from "./teacherController.js";

const SUSPEND_STUDENT = `
  UPDATE students
  SET suspended = 1
  WHERE email = ?;
`;

export async function getCommonStudent(params) {
  const connection = await db.getConnection();
  const placeholders = params.map(() => "?").join(", ");
  const GET_COMMON_STUDENT = `
    SELECT s.email 
    FROM teacher_student ts
    JOIN students s ON ts.student_id = s.id
    WHERE ts.teacher_id IN (
    SELECT t.id
    FROM teachers t
    WHERE t.email IN (${placeholders}))
    `;
  try {
    const [result] = await connection.execute(GET_COMMON_STUDENT, params);
    return result;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

export async function suspendStudent(params) {
  const connection = await db.getConnection();
  try {
    // Check if the value already exists
    const [existingRow] = await connection.execute(SELECT_STUDENT_ID, params);

    if (existingRow.length > 0) {
      await connection.execute(SUSPEND_STUDENT, params);
    }
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}
