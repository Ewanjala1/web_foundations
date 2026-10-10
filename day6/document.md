# School Database Design

## Tables

### students

- Holds one row per student: `student_id` (primary key), `name` and `email`.
- `name` and `email` are `NOT NULL`, and `email` is `UNIQUE` so two students cannot share an address.

### courses

- Holds one row per course: `course_id` (primary key), `title` and `credits`.
- `credits` must be greater than zero.

### enrolments

- Holds one row for each time a student is enrolled on a course: `student_id`, `course_id`, `enrolled_on` and `grade`.
- Both IDs are foreign keys pointing to `students` and `courses`.
- The primary key is the pair (`student_id`, `course_id`), so the same student cannot enrol on the same course twice.
- `grade` is allowed to be `NULL` because a new enrolment has not been marked yet, and a `CHECK` keeps it between 0 and 100.
- The grade lives here, not in `students` or `courses`, because it describes the _combination_ of a student and a course.

## Relationships

- **students to enrolments: one-to-many.** One student can have many enrolments, but each enrolment belongs to exactly one student.
- **courses to enrolments: one-to-many.** One course can have many enrolments, but each enrolment belongs to exactly one course.
- **students to courses: many-to-many.** One student takes many courses, and one course has many students.

A relational table cannot store a list of courses inside one student row without repeating data or breaking the one-value-per-cell rule. A join table solves this: `enrolments` turns one many-to-many relationship into two one-to-many relationships. It is also the natural home for facts about the pairing, such as the grade and the enrolment date.

## Index I would add

```sql
CREATE INDEX idx_enrolments_course ON enrolments (course_id);
```

The primary key (`student_id`, `course_id`) already gives a fast lookup by student, but searching by `course_id` alone, as in "all students on one course" or "students per course", cannot use it efficiently. Without this index SQLite would scan the whole enrolments table, which becomes slow once there are thousands of rows.

## SQL or NoSQL?

I would choose SQL for this system. The data is clearly structured and relational: students, courses and enrolments always have the same fields and link to each other through well-defined keys.
A relational database enforces the rules I care about directly, such as unique emails, no duplicate enrolments, and no enrolment for a student or course that does not exist.
It also handles the queries this system needs, such as joining tables, counting students per course and finding students with no enrolments, in a few lines of SQL, and transactions keep grades consistent when several people update data at once.
