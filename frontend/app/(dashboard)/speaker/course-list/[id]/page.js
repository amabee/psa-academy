import Header from '@/components/shared/header'
import React from 'react'

const EnrolledStudentsPage = () => {
  return (
    <div className="teacher-courses">
    <Header
        title="Enrolled Students"
        subtitle="View Enrolled Students"
    />
    {/* <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
    />
    <div className="teacher-courses__grid">
        {filteredCourses.map((course) => (
            <TeacherCourseCard
                key={course.courseId}
                course={course}
                isViewStudents={true}
                onStudentLinkClick={routeToStudentList}
                isOwner={course.teacherId === user}
            />
        ))}
    </div> */}
</div>
  )
}

export default EnrolledStudentsPage