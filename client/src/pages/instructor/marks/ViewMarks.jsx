import React, { useState, useEffect } from "react";
import InstructorLayout from "../../../layouts/InstructorLayout";
import MarksTable from "../../../components/tables/MarksTable";
import SelectField from "../../../components/inputs/SelectField";
import { fetchResponse } from "../../../api/service";
import { instructorEndpoints } from "../../../api/endpoints/instructorEndpoints";
import { courseEndpoints } from "../../../api/endpoints/courseEndpoints";
import { toastErrorObject, toastSuccessObject } from "../../../utility/toasts";
import { toast } from "react-toastify";

const EXAM_TYPES = [
  { title: "Quiz", value: "Quiz" },
  { title: "Assignment", value: "Assignment" },
  { title: "Mid Term", value: "Mid Term" },
  { title: "Final Term", value: "Final Term" },
];

export default function ViewMarks() {
  const instructorId = JSON.parse(localStorage.getItem("instructor"))._id;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [examType, setExamType] = useState("");
  const [activityNumber, setActivityNumber] = useState("1");
  const [totalMarks, setTotalMarks] = useState(100);
  const [marksData, setMarksData] = useState([]);
  const [recordIds, setRecordIds] = useState([]);
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
    if (!selectedCourse || !examType) return;
    setIsLoading(true);
    try {
      const res = await fetchResponse(
        instructorEndpoints.getAcademics(instructorId, selectedCourse, examType, activityNumber),
        0, null
      );
      if (!res.success) { toast.error(res.message, toastErrorObject); setIsLoading(false); return; }
      const records = res.data || [];
      setTotalMarks(records[0]?.totalMarks || 100);
      setRecordIds(records.map((r) => r._id));
      setMarksData(records.map((r) => ({
        studentId: r.studentId,
        name: r.name,
        obtainedMarks: r.obtainedMarks,
        isPublic: r.isPublic,
      })));
      setIsLoading(false);
    } catch (error) { setIsLoading(false); }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (!marksData.length) { toast.error("Load records first.", toastErrorObject); return; }
    setIsSubmitting(true);
    try {
      await Promise.all(
        marksData.map((item, idx) =>
          fetchResponse(instructorEndpoints.editAcademics(recordIds[idx]), 2, {
            obtainedMarks: item.obtainedMarks,
            isPublic: item.isPublic,
          })
        )
      );
      toast.success("Marks updated successfully.", toastSuccessObject);
      setIsSubmitting(false);
    } catch (error) { setIsSubmitting(false); }
  }

  return (
    <InstructorLayout isLoading={isLoading}>
      <form onSubmit={handleUpdate}>
        <div className="row mb-3">
          <div className="col-md-3">
            <SelectField label="Course" options={courses.map((c) => ({ title: c.title, value: c._id }))} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required={true} />
          </div>
          <div className="col-md-3">
            <SelectField label="Exam Type" options={EXAM_TYPES} value={examType} onChange={(e) => setExamType(e.target.value)} required={true} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Activity #</label>
            <input type="number" className="form-control" value={activityNumber} onChange={(e) => setActivityNumber(e.target.value)} min="1" required />
          </div>
          <div className="col-md-2 d-flex align-items-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={handleLoad}>Load</button>
            <button type="submit" className="btn btn-dark" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update"}</button>
          </div>
        </div>
      </form>
      <MarksTable
        styles={"table-bordered"}
        headers={["Name", `Marks (/${totalMarks})`, "Include"]}
        data={marksData}
        setData={setMarksData}
        dataAttributes={["name", "obtainedMarks", "isPublic"]}
        totalMarks={totalMarks}
      />
    </InstructorLayout>
  );
}
