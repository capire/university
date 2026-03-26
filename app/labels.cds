using { capire.university } from '../db/schema';

// --- Courses ---
annotate university.Courses with @title: '{i18n>Courses}' {
  ID          @title: '{i18n>ID}';
  title       @title: '{i18n>Title}';
  description @title: '{i18n>Description}';
  credits     @title: '{i18n>Credits}';
  semester    @title: '{i18n>Semester}';
  professor   @title: '{i18n>Professor}';
  enrollments @title: '{i18n>Enrollments}';
}

// --- Professors ---
annotate university.Professors with @title: '{i18n>Professors}' {
  ID         @title: '{i18n>ID}';
  firstName  @title: '{i18n>FirstName}';
  lastName   @title: '{i18n>LastName}';
  email      @title: '{i18n>Email}';
  department @title: '{i18n>Department}';
  courses    @title: '{i18n>Courses}';
}

// --- Students ---
annotate university.Students with @title: '{i18n>Students}' {
  ID            @title: '{i18n>ID}';
  firstName     @title: '{i18n>FirstName}';
  lastName      @title: '{i18n>LastName}';
  email         @title: '{i18n>Email}';
  matriculation @title: '{i18n>Matriculation}';
  enrollments   @title: '{i18n>Enrollments}';
}

// --- Enrollments ---
annotate university.Enrollments with @title: '{i18n>Enrollments}' {
  ID      @title: '{i18n>ID}';
  course  @title: '{i18n>Course}';
  student @title: '{i18n>Student}';
  grade   @title: '{i18n>Grade}';
  status  @title: '{i18n>Status}';
}
