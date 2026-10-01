using { capire.university } from '../db/schema';

service CourseService {
  entity Courses     as projection on university.Courses;
  entity Professors  as projection on university.Professors;
  entity Students    as projection on university.Students;
  entity Enrollments as projection on university.Enrollments;
}
