import React, { useEffect, useState } from "react";
import InstructorLayout from "../../../layouts/InstructorLayout";
import AttendanceTable from "../../../components/tables/AttendanceTable";
import SelectField from "../../../components/inputs/SelectField";
import { fetchResponse } from "../../../api/service";
import { instructorEndpoints } from "../../../api/endpoints/instructorEndpoints";
import { courseEndpoints } from "../../../api/endpoints/courseEndpoints";
import { toastErrorObject, toastSuccessObject } from "../../../utility/toasts";
import { toast } from "react-toastify";

export default function PostAttendance() {
  const instructorId = JSON.parse(localStorage.getItem("instructor"))._id;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleLoad() {
    if (!selectedCourse || !date) return;
    setIsLoading(true);
    try {
      const studentsRes = await fetchResponse(courseEndpoints.getStudentsOfInstructor(selectedCourse), 0, null);
      if (!studentsRes.success) { toast.error(studentsRes.message, toastErrorObject); setIsLoading(false); return; }
      const students = studentsRes.data || [];
      const mapped = students.map((s) => ({
        studentId: s._id,
        name: s.fname + " " + s.lname,
        status: "P",
        isPublic: true,
      }));
      setAttendanceData(mapped);
      setIsLoading(false);
    } catch (error) { setIsLoading(false); }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!attendanceData.length) { toast.error("Load students first.", toastErrorObject); return; }
    setIsSubmitting(true);
    try {
      const res = await fetchResponse(instructorEndpoints.postAttendance(), 1, {
        instructorId,
        courseId: selectedCourse,
        date,
        attendances: attendanceData,
      });
      if (!res.success) { toast.error(res.message, toastErrorObject); setIsSubmitting(false); return; }
      toast.success(res.message, toastSuccessObject);
      setAttendanceData([]);
      setIsSubmitting(false);
    } catch (error) { setIsSubmitting(false); }
  }

  return (
    <InstructorLayout isLoading={isLoading}>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4">
            <SelectField
              label="Course"
              options={courses.map((c) => ({ title: c.title, value: c._id }))}
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required={true}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button type="button" className="btn btn-secondary me-2" onClick={handleLoad}>
              Load Students
            </button>
            <button type="submit" className="btn btn-dark" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
      <AttendanceTable
        styles={"table-bordered"}
        headers={["Name", "Status", "Include"]}
        data={attendanceData}
        setData={setAttendanceData}
        dataAttributes={["name", "status", "isPublic"]}
      />
    </InstructorLayout>
  );
}
