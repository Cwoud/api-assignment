import dotenv from "dotenv";
import mysql from "mysql2";

//For env File
dotenv.config();

const dbConfig = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export default dbConfig.promise();
