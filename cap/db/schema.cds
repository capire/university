namespace capire.university;

using { cuid, managed } from '@sap/cds/common';

entity Courses : cuid, managed {
  title       : String(200)   @mandatory;
  description : String(5000);
  credits     : Integer       @mandatory  @assert.range: [ 1, 30 ];
  semester    : String(20)    @mandatory;
  professor   : Association to Professors  @mandatory;
  enrollments : Composition of many Enrollments on enrollments.course = $self;
}

entity Professors : cuid, managed {
  firstName   : String(100) @mandatory;
  lastName    : String(100) @mandatory;
  email       : String(200) @assert.format: '^[^\s@]+@[^\s@]+\.[^\s@]+$';
  department  : String(200);
  courses     : Association to many Courses on courses.professor = $self;
}

entity Students : cuid, managed {
  firstName     : String(100) @mandatory;
  lastName      : String(100) @mandatory;
  email         : String(200) @assert.format: '^[^\s@]+@[^\s@]+\.[^\s@]+$';
  matriculation : String(20)  @mandatory  @assert.unique;
  enrollments   : Composition of many Enrollments on enrollments.student = $self;
}

entity Enrollments : cuid, managed {
  course      : Association to Courses  @mandatory;
  student     : Association to Students @mandatory;
  grade       : String(5);
  status      : String enum { enrolled; completed; dropped } default 'enrolled';
}

annotate Enrollments with @assert.unique: { enrollment: [ course, student ] };
