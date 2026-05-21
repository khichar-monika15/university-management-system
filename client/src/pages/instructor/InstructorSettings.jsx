import React, { useState } from "react";
import InstructorLayout from "../../layouts/InstructorLayout";
import GeneralCard from "../../components/cards/GeneralCard";
import SignupForm from "../../components/forms/SignupForm";
import { instructorEndpoints } from "../../api/endpoints/instructorEndpoints";
import { fetchResponse } from "../../api/service";
import { toastErrorObject, toastSuccessObject } from "../../utility/toasts";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";

export default function InstructorSettings() {
  const instructorId = JSON.parse(localStorage.getItem("instructor"))._id;
  const { instructorData, setInstructorData } = useAuth();
  const [details, setDetails] = useState({
    fname: instructorData?.fname,
    lname: instructorData?.lname,
    email: instructorData?.email,
    password: instructorData?.password,
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetchResponse(instructorEndpoints.editInstructor(instructorId), 2, details);
      if (!res.success) {
        toast.error(res.message, toastErrorObject);
        setIsLoading(false);
        return;
      }
      toast.success(res.message, toastSuccessObject);
      const updated = { ...instructorData, ...details };
      setInstructorData(updated);
      localStorage.setItem("instructor", JSON.stringify(updated));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <InstructorLayout isLoading={isLoading}>
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
    </InstructorLayout>
  );
}
