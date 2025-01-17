import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendurl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Login"); // "Login" or "Sign Up"
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [otpSent, setOTPSent] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [otp, setOTP] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleOTPRequest = async () => {
    try {
      const endpoint =
        state === "Sign Up"
          ? "/api/user/register/request-otp"
          : "/api/user/forgot/request-otp";

      const payload =
        state === "Sign Up"
          ? { name, email,password }
          : { email };

      const { data } = await axios.post(backendurl + endpoint, payload);
      if (data.success) {
        toast.success(data.message);
        setOTPSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        const endpoint = otpSent
          ? "/api/user/register/verifyotp-register"
          : "/api/user/register";

        const payload = otpSent
          ? { name, email, password, repassword, otp }
          : { name, email, password };

        const { data } = await axios.post(backendurl + endpoint, payload);
        if (data.success) {
          toast.success(data.message);
          if (otpSent) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
          }
        } else {
          toast.error(data.message);
        }
      } else if (forgotPasswordMode) {
        const endpoint = otpSent
          ? "/api/user/forgot/reset"
          : "/api/user/forgot/request-otp";

        const payload = otpSent
          ? { email, password, repassword, otp }
          : { email };

        const { data } = await axios.post(backendurl + endpoint, payload);
        if (data.success) {
          toast.success(data.message);
          if (otpSent) {
            setForgotPasswordMode(false);
          } else {
            setOTPSent(true);
          }
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendurl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up"
            ? "Create Account"
            : forgotPasswordMode
            ? "Forgot Password"
            : "Login"}
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {(state === "Sign Up" || forgotPasswordMode) && (
          <div className="w-full">
            <p>Re-Enter Password</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="password"
              value={repassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
          </div>
        )}

        {otpSent && (
          <div className="w-full">
            <p>OTP</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              required
            />
          </div>
        )}

        {!otpSent && (
          <button
            type="button"
            onClick={handleOTPRequest}
            className="bg-primary text-white w-full py-2 rounded-md text-base"
          >
            {forgotPasswordMode || state === "Sign Up"
              ? "Send OTP"
              : "Login"}
          </button>
        )}

        {otpSent && (
          <button
            type="submit"
            className="bg-primary text-white w-full py-2 rounded-md text-base"
          >
            {forgotPasswordMode
              ? "Reset Password"
              : state === "Sign Up"
              ? "Create Account"
              : "Login"}
          </button>
        )}

        {!forgotPasswordMode && state !== "Sign Up" && (
          <button
            type="button"
            onClick={() => setForgotPasswordMode(true)}
            className="text-primary underline cursor-pointer"
          >
            Forgot Password?
          </button>
        )}

        {forgotPasswordMode || state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("Login");
                setForgotPasswordMode(false);
                setOTPSent(false);
              }}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => {
                setState("Sign Up");
                setForgotPasswordMode(false);
                setOTPSent(false);
              }}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
