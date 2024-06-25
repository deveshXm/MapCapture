import { notification } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { apiService } from "../services/apiService";
import { setCredentials } from "../store/authSlice";

import { Title } from "../components/ui/Title";
import GradientButton from "../components/ui/GradientButton";
import { GradientInput } from "../components/ui/Gradientinput";
import { Label, LabelInputContainer } from "../components/ui/label";
import { AuroraBackground } from "../components/ui/aurora-background";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiService.register(username, email, password);
      dispatch(setCredentials({ token: response.token, user: response.user }));
      notification.success({ message: "Registration successful!" });
      navigate("/dashboard"); // Redirect to dashboard or any other page
    } catch (error: any) {
      switch (error.response.status) {
        case 409:
          notification.error({ message: "User already exists." });
          break;
        case 400:
          notification.error({ message: "Validation failed. Please check your input." });
          break;
        default:
          notification.error({ message: "An unexpected error occurred. Please try again." });
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: any) => setUsername(e.target.value);

  const handleEmailChange = (e: any) => setEmail(e.target.value);

  const handlePasswordChange = (e: any) => setPassword(e.target.value);

  const handleLogin = () => navigate("/login");

  return (
    <AuroraBackground>
      <div className=" h-full flex justify-center items-center relative">
        <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-[0px_0px_0px_0.2px_#686869] bg-black min-w-80 md:min-w-96">
          <Title>Register</Title>
          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="text">Name</Label>
              <GradientInput id="text" placeholder="Luke Skywalker" type="name" onChange={handleNameChange} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email</Label>
              <GradientInput id="email" placeholder="luke@skywalker.com" type="email" onChange={handleEmailChange} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-6">
              <Label htmlFor="password">Password</Label>
              <GradientInput id="password" placeholder="••••••••" type="Password" onChange={handlePasswordChange} minLength={6} />
            </LabelInputContainer>
            <GradientButton type="submit" disabled={loading}>
              Register &rarr;
            </GradientButton>
          </form>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          <GradientButton type="submit" onClick={handleLogin} disabled={loading}>
            &larr; Login
          </GradientButton>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Register;
