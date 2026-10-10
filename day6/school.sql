-- School database: students, courses and enrolments 

PRAGMA foreign_keys = ON;

-- Drop in child-first order so the script can be run again
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- 1. TABLES
-- ============================================================

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    title     TEXT NOT NULL,
    credits   INTEGER NOT NULL CHECK (credits > 0)
);

-- Join table: one row = one student enrolled on one course.
-- The composite primary key stops the same student enrolling
-- on the same course twice.
CREATE TABLE enrolments (
    student_id  INTEGER NOT NULL,
    course_id   INTEGER NOT NULL,
    enrolled_on TEXT NOT NULL,
    grade       INTEGER CHECK (grade BETWEEN 0 AND 100),  -- NULL until graded
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students (student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses (course_id)   ON DELETE CASCADE
);

-- ============================================================
-- 2. SAMPLE DATA
-- ============================================================

INSERT INTO students (student_id, name, email) VALUES
    (1, 'Amina Wanjiru', 'amina@school.test'),
    (2, 'Brian Otieno',  'brian@school.test'),
    (3, 'Cynthia Achieng', 'cynthia@school.test'),
    (4, 'David Kamau',   'david@school.test');   -- no enrolments yet

INSERT INTO courses (course_id, title, credits) VALUES
    (1, 'Web Development', 4),
    (2, 'Databases',       3),
    (3, 'Mathematics',     3),
    (4, 'Art History',     2);                   -- no students yet

INSERT INTO enrolments (student_id, course_id, enrolled_on, grade) VALUES
    (1, 1, '2026-09-01', 88),
    (1, 2, '2026-09-01', 92),
    (2, 1, '2026-09-02', 75),
    (3, 1, '2026-09-02', NULL),
    (3, 2, '2026-09-03', 81),
    (3, 3, '2026-09-03', 69);

-- ============================================================
-- 3. QUERIES
-- ============================================================

-- Query 1: all courses for one student (by name)
SELECT c.title, c.credits, e.grade
FROM students s
JOIN enrolments e ON e.student_id = s.student_id
JOIN courses c    ON c.course_id  = e.course_id
WHERE s.name = 'Amina Wanjiru'
ORDER BY c.title;

-- Query 2: all students on one course
SELECT s.name, s.email, e.grade
FROM courses c
JOIN enrolments e ON e.course_id  = c.course_id
JOIN students s   ON s.student_id = e.student_id
WHERE c.title = 'Web Development'
ORDER BY s.name;

-- Query 3: number of students per course (courses with no students show 0)
SELECT c.title, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON e.course_id = c.course_id
GROUP BY c.course_id, c.title
ORDER BY student_count DESC, c.title;

-- Query 4: students who have no enrolments
SELECT s.student_id, s.name, s.email
FROM students s
LEFT JOIN enrolments e ON e.student_id = s.student_id
WHERE e.student_id IS NULL;

-- Query 5: update one enrolment's grade (Cynthia, Web Development)
UPDATE enrolments
SET grade = 84
WHERE student_id = (SELECT student_id FROM students WHERE name = 'Cynthia Achieng')
  AND course_id  = (SELECT course_id  FROM courses  WHERE title = 'Web Development');

-- Check the update
SELECT s.name, c.title, e.grade
FROM enrolments e
JOIN students s ON s.student_id = e.student_id
JOIN courses c  ON c.course_id  = e.course_id
WHERE s.name = 'Cynthia Achieng'
ORDER BY c.title;