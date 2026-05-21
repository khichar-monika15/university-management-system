import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import DynamicTable from "../../components/tables/DynamicTable";
import SelectField from "../../components/inputs/SelectField";
import { fetchResponse } from "../../api/service";
import { studentEndpoints } from "../../api/endpoints/studentEndpoints";
import { courseEndpoints } from "../../api/endpoints/courseEndpoints";
import { toastErrorObject } from "../../utility/toasts";
import { toast } from "react-toastify";

export default function Attendance() {
  const studentId = JSON.parse(localStorage.getItem("student"))._id;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetchResponse(courseEndpoints.getCoursesOfStudent(studentId), 0, null);
        if (!res.success) { toast.error(res.message, toastErrorObject); setIsLoading(false); return; }
        setCourses(res.data || []);
        setIsLoading(false);
      } catch (error) { setIsLoading(false); }
    }
    fetchCourses();
  }, [studentId]);

  useEffect(() => {
    if (!selectedCourse) { setAttendance([]); return; }
    setIsLoading(true);
    async function fetchAttendance() {
      try {
        const res = await fetchResponse(
          studentEndpoints.getAttendances(studentId, selectedCourse),
          0, null
        );
        if (!res.success) { toast.error(res.message, toastErrorObject); setIsLoading(false); return; }
        setAttendance(res.data || []);
        setIsLoading(false);
      } catch (error) { setIsLoading(false); }
    }
    fetchAttendance();
  }, [selectedCourse, studentId]);

  const total = attendance.length;
  const present = attendance.filter((a) => a.status === "P").length;
  const percentage = total ? Math.round((present / total) * 100) : 0;

  return (
    <StudentLayout isLoading={isLoading}>
      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <SelectField
          label="Select Course"
          options={courses.map((c) => ({ title: c.title, value: c._id }))}
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        />
      </div>
      {selectedCourse && (
        <div className="alert alert-secondary mb-3">
          Attendance: <strong>{present}/{total}</strong> — <strong>{percentage}%</strong>
        </div>
      )}
      <DynamicTable
        styles={"table-bordered"}
        headers={["Date", "Status"]}
        data={attendance}
        dataAttributes={["date", "status"]}
      />
    </StudentLayout>
  );
}
