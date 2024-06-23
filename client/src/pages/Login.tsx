import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { apiService } from "../services/apiService";
import { setCredentials } from "../store/authSlice";
import { notification } from "antd";
import { Label, LabelInputContainer } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { BottomGradient } from "../components/ui/gradient";
import { AuroraBackground } from "../components/ui/aurora-background";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.login(email, password);
      dispatch(setCredentials({ token: response.token, user: response.user }));
    } catch (error) {
      notification.error({ message: "Invalid Credentials." });
    }
  };

  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handlePasswordChange = (e: any) => setPassword(e.target.value);
  const handleRegister = () => navigate("/register");

  return (
    <AuroraBackground>
      <div className=" h-full flex justify-center items-center relative">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-[0px_0px_0px_0.2px_#686869] bg-black min-w-96">
          <h2 className="font-bold text-3xl text-neutral-200">Login</h2>
          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="luke@skywalker.com" type="email" onChange={handleEmailChange} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-6">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="••••••••" type="Password" onChange={handlePasswordChange} />
            </LabelInputContainer>
            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Login &rarr;
              <BottomGradient />
            </button>
          </form>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            onClick={handleRegister}
          >
            &larr; Register
            <BottomGradient />
          </button>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Login;
