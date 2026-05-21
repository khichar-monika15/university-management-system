import React, { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import RegisterCourseTable from "../../components/tables/RegisterCourseTable";
import { fetchResponse } from "../../api/service";
import { courseEndpoints } from "../../api/endpoints/courseEndpoints";
import { toastErrorObject, toastSuccessObject } from "../../utility/toasts";
import { toast } from "react-toastify";

export default function RegisterCourse() {
  const studentId = JSON.parse(localStorage.getItem("student"))._id;
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchResponse(courseEndpoints.getOfferedCourses(), 0, null);
        if (!res.success) { toast.error(res.message, toastErrorObject); setIsLoading(false); return; }
        setCourses(res.data || []);
        setIsLoading(false);
      } catch (error) { setIsLoading(false); }
    }
    fetchData();
  }, []);

  async function handleRegister(course) {
    try {
      const res = await fetchResponse(courseEndpoints.registerCourseByStudent(), 1, {
        studentId,
        courseId: course._id,
      });
      if (!res.success) { toast.error(res.message, toastErrorObject); return; }
      toast.success(res.message, toastSuccessObject);
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
    } catch (error) {
    }
  }

  return (
    <StudentLayout isLoading={isLoading}>
      <RegisterCourseTable
        styles={"table-bordered"}
        headers={["Title", "Code", "Type", "Credit Hours", "Fee", "Offered Date", "Action"]}
        data={courses}
        dataAttributes={["title", "code", "type", "creditHours", "fee", "createdAt", "action"]}
        handleAction={handleRegister}
      />
    </StudentLayout>
  );
}
