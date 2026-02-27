import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userTypes } from "../../../common/constants";
import { Button } from "../../components";
import { authActions } from "../../redux/auth";
import { routes } from "../../routes";
import { validator } from "../../utils/validators";
import { message } from "antd";

const Signup = () => {
  const { isAuthenticating, vehicles } = useSelector((state) => state.auth);
  const [userType, setuserType] = useState(userTypes.consumer.key);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [vehicle, setvehicle] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.handleListVehicles());
  }, []);

  const handleSubmit = () => {
    message.config({ maxCount: 2 });
    
    if (!name || !email || !vehicle || !password || !confirmPassword) {
      message.error("All fields are required");
      return;
    }
    
    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    
    const nameError = validator.name(name);
    if (nameError) {
      message.error(nameError);
      return;
    }
    
    const emailError = validator.email(email);
    if (emailError) {
      message.error(emailError);
      return;
    }
    
    const passwordError = validator.password(password);
    if (passwordError) {
      message.error(passwordError);
      return;
    }
    
    dispatch(
      authActions.handleSignup({ name, email, vehicle, password, userType })
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 flex items-center justify-center">
            <div className="text-white px-12 max-w-xl">
              <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">Join BatterySwap</h1>
              <p className="text-xl text-white/90 drop-shadow-md">
                The future of electric vehicle battery swapping. Fast, convenient, and eco-friendly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create an Account
            </h2>
            <p className="text-gray-600">
              Specially crafted for electric vehicle owners
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              I'm a
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setuserType(userTypes.consumer.key)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  userType === userTypes.consumer.key
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {userTypes.consumer.label}
              </button>
              <button
                onClick={() => setuserType(userTypes.producer.key)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  userType === userTypes.producer.key
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {userTypes.producer.label}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <div>
              <select
                value={vehicle}
                onChange={(e) => setvehicle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              >
                <option value="">Select your vehicle</option>
                {vehicles?.map((v) => (
                  <option key={v.pk} value={v.pk}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
              <input
                type="password"
                placeholder="Confirmation"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isAuthenticating}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isAuthenticating ? "Creating Account..." : "CREATE AN ACCOUNT"}
            </button>

            <p className="text-sm text-gray-500 text-center">
              By signing up, you agree to our{" "}
              <span className="text-black cursor-pointer hover:underline">
                terms and conditions
              </span>
            </p>

            <div className="text-center pt-4">
              <Link href={routes.SIGNIN}>
                <span className="text-gray-600 hover:text-black transition-colors cursor-pointer">
                  Already have an account?{" "}
                  <span className="font-semibold">Sign In</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
