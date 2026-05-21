import React, { useState } from "react";
import HomeLayout from "../../layouts/HomeLayout";
import GeneralCard from "../../components/cards/GeneralCard";
import LoginForm from "../../components/forms/LoginForm";
import { fetchResponse } from "../../api/service";
import { instructorEndpoints } from "../../api/endpoints/instructorEndpoints";
import { toastErrorObject, toastSuccessObject } from "../../utility/toasts";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function InstructorLogin() {
  const { setInstructorData } = useAuth();
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetchResponse(instructorEndpoints.loginInstructor(), 1, loginDetails);
      if (!res.success) {
        toast.error(res.message, toastErrorObject);
        setIsLoading(false);
        return;
      }
      toast.success(res.message, toastSuccessObject);
      setInstructorData(res.data);
      localStorage.setItem("instructor", JSON.stringify(res.data));
      navigate("/instructor");
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <HomeLayout isLoading={isLoading}>
      <GeneralCard header={"Instructor Login"}>
        <LoginForm
          loginDetails={loginDetails}
          setLoginDetails={setLoginDetails}
          login={handleLogin}
          domain={"instructor"}
        />
      </GeneralCard>
    </HomeLayout>
  );
}
