import { notification } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { apiService } from "../services/apiService";
import { setCredentials } from "../store/authSlice";

import { Title } from "../components/ui/Title";
import { GradientInput } from "../components/ui/Gradientinput";
import GradientButton from "../components/ui/GradientButton";
import { Label, LabelInputContainer } from "../components/ui/label";
import { AuroraBackground } from "../components/ui/aurora-background";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      dispatch(setCredentials({ token: response.token, user: response.user }));
    } catch (error) {
      notification.error({ message: "Invalid Credentials." });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handlePasswordChange = (e: any) => setPassword(e.target.value);
  const handleRegister = () => navigate("/register");

  return (
    <AuroraBackground>
      <div className=" h-full flex justify-center items-center relative">
        <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-[0px_0px_0px_0.2px_#686869] bg-black min-w-80 md:min-w-96">
          <Title>Login</Title>
          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email</Label>
              <GradientInput id="email" placeholder="luke@skywalker.com" type="email" onChange={handleEmailChange} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-6">
              <Label htmlFor="password">Password</Label>
              <GradientInput id="password" placeholder="••••••••" type="Password" onChange={handlePasswordChange} minLength={6} />
            </LabelInputContainer>
            <GradientButton type="submit" disabled={loading}>
              Login &rarr;
            </GradientButton>
          </form>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          <GradientButton onClick={handleRegister} disabled={loading}>
            &larr; Register
          </GradientButton>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Login;
