export const adminNavbarContent = (setAdminData) => {
  function logout() {
    localStorage.removeItem("admin");
    setAdminData(null);
  }
  return {
    options: [
      { title: "Dashboard", path: "/admin" },
      {
        title: "Instructors",
        path: ["/admin/instructors/action", "/admin/instructors/register"],
        children: [
          { title: "View & Action", path: "/admin/instructors/action" },
          { title: "Register", path: "/admin/instructors/register" },
        ],
      },
      {
        title: "Courses",
        path: ["/admin/courses/action", "/admin/courses/register"],
        children: [
          { title: "View & Action", path: "/admin/courses/action" },
          { title: "Register", path: "/admin/courses/register" },
        ],
      },
      { title: "Settings", path: "/admin/settings" },
    ],
    functionalItem: { title: "Logout", function: logout },
  };
};

export const instructorNavbarContent = (setInstructorData) => {
  function logout() {
    localStorage.removeItem("instructor");
    setInstructorData(null);
  }
  return {
    options: [
      { title: "Dashboard", path: "/instructor" },
      { title: "Courses", path: "/instructor/courses" },
      { title: "Students", path: "/instructor/students" },
      { title: "Attendance", path: "/instructor/attendance" },
      {
        title: "Marks",
        path: ["/instructor/marks/post", "/instructor/marks/view-or-update"],
        children: [
          { title: "Post Marks", path: "/instructor/marks/post" },
          { title: "View / Update", path: "/instructor/marks/view-or-update" },
        ],
      },
      { title: "Settings", path: "/instructor/settings" },
    ],
    functionalItem: { title: "Logout", function: logout },
  };
};

export const studentNavbarContent = (setStudentData) => {
  function logout() {
    localStorage.removeItem("student");
    setStudentData(null);
  }
  return {
    options: [
      { title: "Dashboard", path: "/student" },
      { title: "My Courses", path: "/student/courses" },
      { title: "Register Course", path: "/student/register/course" },
      { title: "Attendance", path: "/student/attendance" },
      { title: "Marks", path: "/student/marks" },
      { title: "Settings", path: "/student/settings" },
    ],
    functionalItem: { title: "Logout", function: logout },
  };
};
