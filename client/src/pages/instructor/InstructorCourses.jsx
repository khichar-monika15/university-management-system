import React, { useEffect, useState } from "react";
import InstructorLayout from "../../layouts/InstructorLayout";
import DynamicTable from "../../components/tables/DynamicTable";
import { fetchResponse } from "../../api/service";
import { courseEndpoints } from "../../api/endpoints/courseEndpoints";
import { toastErrorObject } from "../../utility/toasts";
import { toast } from "react-toastify";

export default function InstructorCourses() {
  const instructorId = JSON.parse(localStorage.getItem("instructor"))._id;
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchResponse(courseEndpoints.getCoursesOfInstructor(instructorId), 0, null);
        if (!res.success) {
          toast.error(res.message, toastErrorObject);
          setIsLoading(false);
          return;
        }
        setCourses(res.data || []);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [instructorId]);

  return (
    <InstructorLayout isLoading={isLoading}>
      <DynamicTable
        styles={"table-bordered"}
        headers={["Title", "Code", "Type", "Credit Hours", "Offered Date"]}
        data={courses}
        dataAttributes={["title", "code", "type", "creditHours", "createdAt"]}
      />
    </InstructorLayout>
  );
}
