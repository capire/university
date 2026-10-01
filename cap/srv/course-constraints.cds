using { CourseService } from './course-service';

// --- Courses constraints ---
annotate CourseService.Courses with {

  title @mandatory @assert: (case
    when trim(title) = '' then '{i18n>ASSERT_TITLE_NOT_EMPTY}'
  end);

  credits @mandatory @assert: (case
    when credits < 1 then '{i18n>ASSERT_CREDITS_MIN}'
    when credits > 30 then '{i18n>ASSERT_CREDITS_MAX}'
  end);

  semester @mandatory;

  professor @mandatory @assert.target;
}

// --- Professors constraints ---
annotate CourseService.Professors with {

  firstName @mandatory;
  lastName  @mandatory;

  email @assert.format: {
    $value: '^[^\s@]+@[^\s@]+\.[^\s@]+$',
    message: '{i18n>ASSERT_INVALID_EMAIL}'
  };
}

// --- Students constraints ---
annotate CourseService.Students with {

  firstName @mandatory;
  lastName  @mandatory;

  email @assert.format: {
    $value: '^[^\s@]+@[^\s@]+\.[^\s@]+$',
    message: '{i18n>ASSERT_INVALID_EMAIL}'
  };

  matriculation @mandatory @assert.unique @assert: (case
    when trim(matriculation) = '' then '{i18n>ASSERT_MATRICULATION_NOT_EMPTY}'
  end);
}

// --- Enrollments constraints ---
annotate CourseService.Enrollments with {

  course  @mandatory @assert.target;
  student @mandatory @assert.target;

  grade @assert: (case
    when grade is not null and cast(grade as Decimal) < 1.0
      then '{i18n>ASSERT_GRADE_MIN}'
    when grade is not null and cast(grade as Decimal) > 5.0
      then '{i18n>ASSERT_GRADE_MAX}'
  end);
}

annotate CourseService.Enrollments with @assert.unique: {
  enrollment: [ course, student ]
};
