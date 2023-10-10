# README
Database setup: The database has been hosted by me with password which is not safe to be exposed in github
Alternatively, the mysql table has been designed with the following schema:

```
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  suspended TINYINT(1) DEFAULT 0
);

CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE teacher_student (
  teacher_id INT NOT NULL,
  student_id INT NOT NULL,
  PRIMARY KEY (teacher_id, student_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

The database can be setup with .env file with the following format to test the api:
DATABASE_HOST = <insert mysql database host here>
DATABASE_USERNAME = <insert username here>
DATABASE_PASSWORD = <insert password here>
DATABASE_NAME = <insert database name here>
```

To setup the code to be run, please download the package first by running the following command:
npm i

To run the code locally, please run the following command:
npm start

After the server has started, you may test the api accordingly. 