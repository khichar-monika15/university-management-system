import React, { useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import GeneralCard from "../../components/cards/GeneralCard";
import SignupForm from "../../components/forms/SignupForm";
import { studentEndpoints } from "../../api/endpoints/studentEndpoints";
import { fetchResponse } from "../../api/service";
import { toastErrorObject, toastSuccessObject } from "../../utility/toasts";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";

export default function StudentSettings() {
  const studentId = JSON.parse(localStorage.getItem("student"))._id;
  const { studentData, setStudentData } = useAuth();
  const [details, setDetails] = useState({
    fname: studentData?.fname,
    lname: studentData?.lname,
    email: studentData?.email,
    password: studentData?.password,
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetchResponse(studentEndpoints.editStudent(studentId), 2, details);
      if (!res.success) {
        toast.error(res.message, toastErrorObject);
        setIsLoading(false);
        return;
      }
      toast.success(res.message, toastSuccessObject);
      const updated = { ...studentData, ...details };
      setStudentData(updated);
      localStorage.setItem("student", JSON.stringify(updated));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <StudentLayout isLoading={isLoading}>
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "81vh" }}>
        <GeneralCard header={"Edit Information"}>
          <SignupForm
            signupDetails={details}
            setSignupDetails={setDetails}
            signup={handleUpdate}
            update={true}
          />
        </GeneralCard>
      </div>
    </StudentLayout>
  );
}
