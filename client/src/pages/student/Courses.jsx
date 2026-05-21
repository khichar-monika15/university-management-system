import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import DynamicTable from "../../components/tables/DynamicTable";
import { fetchResponse } from "../../api/service";
import { courseEndpoints } from "../../api/endpoints/courseEndpoints";
import { toastErrorObject } from "../../utility/toasts";
import { toast } from "react-toastify";

export default function Courses() {
  const studentId = JSON.parse(localStorage.getItem("student"))._id;
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchResponse(courseEndpoints.getCoursesOfStudent(studentId), 0, null);
        if (!res.success) { toast.error(res.message, toastErrorObject); setIsLoading(false); return; }
        setCourses(res.data || []);
        setIsLoading(false);
      } catch (error) { setIsLoading(false); }
    }
    fetchData();
  }, [studentId]);

  return (
    <StudentLayout isLoading={isLoading}>
      <DynamicTable
        styles={"table-bordered"}
        headers={["Title", "Code", "Type", "Credit Hours", "Registration Date"]}
        data={courses}
        dataAttributes={["title", "code", "type", "creditHours", "createdAt"]}
      />
    </StudentLayout>
  );
}
