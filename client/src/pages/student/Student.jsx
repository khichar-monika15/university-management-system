import React from "react";
import StudentLayout from "../../layouts/StudentLayout";
import OneOnOneDynamicTable from "../../components/tables/OneOnOneDynamicTable";
import { useAuth } from "../../contexts/authContext";

export default function Student() {
  const { studentData } = useAuth();

  return (
    <StudentLayout>
      <OneOnOneDynamicTable
        data={[
          { title: "Name", value: studentData?.fname + " " + studentData?.lname },
          { title: "Email Address", value: studentData?.email },
          { title: "Registration Date", value: studentData?.createdAt },
        ]}
        styles={"bg-secondary text-white"}
      />
    </StudentLayout>
  );
}
