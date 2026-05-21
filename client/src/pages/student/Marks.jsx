import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import DynamicTable from "../../components/tables/DynamicTable";
import SelectField from "../../components/inputs/SelectField";
import { fetchResponse } from "../../api/service";
import { studentEndpoints } from "../../api/endpoints/studentEndpoints";
import { toastErrorObject } from "../../utility/toasts";
import { toast } from "react-toastify";

const EXAM_TYPES = [
  { title: "Quiz", value: "Quiz" },
  { title: "Assignment", value: "Assignment" },
  { title: "Mid Term", value: "Mid Term" },
  { title: "Final Term", value: "Final Term" },
];

export default function Marks() {
  const studentId = JSON.parse(localStorage.getItem("student"))._id;
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [examType, setExamType] = useState("");
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourseNames() {
      try {
        const res = await fetchResponse(studentEndpoints.getCourseAndExamTypeNames(studentId), 0, null);
        if (!res.success) { toast.error(res.message, toastErrorObject); setIsLoading(false); return; }
        const courses = (res.data?.courses || []).map((c) => ({ title: c.title, value: c._id }));
        setCourseOptions(courses);
        setIsLoading(false);
      } catch (error) { setIsLoading(false); }
    }
    fetchCourseNames();
  }, [studentId]);

  useEffect(() => {
    if (!selectedCourse || !examType) { setMarks([]); return; }
    setIsLoading(true);
    async function fetchMarks() {
      try {
        const res = await fetchResponse(
          studentEndpoints.getAcademics(studentId, selectedCourse, examType),
          0, null
        );
        if (!res.success) { toast.error(res.message, toastErrorObject); setIsLoading(false); return; }
        setMarks(res.data || []);
        setIsLoading(false);
      } catch (error) { setIsLoading(false); }
    }
    fetchMarks();
  }, [selectedCourse, examType, studentId]);

  return (
    <StudentLayout isLoading={isLoading}>
      <div className="row mb-3">
        <div className="col-md-4">
          <SelectField
            label="Course"
            options={courseOptions}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <SelectField
            label="Exam Type"
            options={EXAM_TYPES}
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          />
        </div>
      </div>
      <DynamicTable
        styles={"table-bordered"}
        headers={["Activity #", "Obtained Marks", "Total Marks", "Date"]}
        data={marks}
        dataAttributes={["activityNumber", "obtainedMarks", "totalMarks", "createdAt"]}
      />
    </StudentLayout>
  );
}
