import React, { useEffect, useState } from "react";
import InstructorLayout from "../../layouts/InstructorLayout";
import DynamicTable from "../../components/tables/DynamicTable";
import SelectField from "../../components/inputs/SelectField";
import { fetchResponse } from "../../api/service";
import { courseEndpoints } from "../../api/endpoints/courseEndpoints";
import { toastErrorObject } from "../../utility/toasts";
import { toast } from "react-toastify";

export default function InstructorStudents() {
  const instructorId = JSON.parse(localStorage.getItem("instructor"))._id;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetchResponse(courseEndpoints.getCoursesOfInstructor(instructorId), 0, null);
        if (!res.success) { toast.error(res.message, toastErrorObject); setIsLoading(false); return; }
        setCourses(res.data || []);
        setIsLoading(false);
      } catch (error) { setIsLoading(false); }
    }
    fetchCourses();
  }, [instructorId]);

  useEffect(() => {
    if (!selectedCourse) { setStudents([]); return; }
    setIsLoading(true);
    async function fetchStudents() {
      try {
        const res = await fetchResponse(courseEndpoints.getStudentsOfInstructor(selectedCourse), 0, null);
        if (!res.success) { toast.error(res.message, toastErrorObject); setIsLoading(false); return; }
        setStudents(res.data || []);
        setIsLoading(false);
      } catch (error) { setIsLoading(false); }
    }
    fetchStudents();
  }, [selectedCourse]);

  return (
    <InstructorLayout isLoading={isLoading}>
      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <SelectField
          label="Select Course"
          options={courses.map((c) => ({ title: c.title, value: c._id }))}
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        />
      </div>
      <DynamicTable
        styles={"table-bordered"}
        headers={["First Name", "Last Name", "Email", "Registration Date"]}
        data={students}
        dataAttributes={["fname", "lname", "email", "createdAt"]}
      />
    </InstructorLayout>
  );
}
