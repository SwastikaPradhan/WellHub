'use client';

import { useState } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { GoogleLogin } from '@react-oauth/google';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams=useSearchParams();
  const redirect=searchParams.get("redirect");

  const handleSignUp = async () => {
    setError('');
    setSuccess('');

    // Basic frontend validations
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
          confirmPassword
        }),
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to sign up.');
      }
      localStorage.setItem("token", data.token);  //store token in localstorage
      setSuccess('🎉 Welcome to WellBeing Hub.');
      setTimeout(() => {
        router.push(redirect || '/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Oops. That was not supposed to happen.');

    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-yellow-100 font-mono">
      <div className="border-4 border-black p-10 w-full max-w-xl text-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-6">Sign Up</h1>
        <p className="text-center mb-8 text-xs italic">We promise this won't steal your soul. Probably.</p>
        <input
          type="text"
          placeholder="👤 Username (make it cool)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-black bg-gray-100 placeholder-gray-600"
        />
        <input
          type="email"
          placeholder="📧 Email (don’t use your school one)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-black bg-gray-100 placeholder-gray-600"
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="🔐 Password (1234 not allowed)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-10 border-2 border-black bg-gray-100 placeholder-gray-600"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-3 right-3 cursor-pointer text-xl"
          >
            {showPassword ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
          </span>
        </div>

        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 pr-10 border-2 border-black bg-gray-100 placeholder-gray-600"
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute top-3 right-3 cursor-pointer text-xl"
          >
            {showConfirmPassword ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
          </span>
        </div>

        <button
          onClick={handleSignUp}
          className="w-full bg-black text-white p-3 uppercase text-lg font-bold hover:bg-white hover:text-black hover:border-black border-2 transition duration-200"
        >
          Signup
        </button>

        {/*Google Auth Button */}
        <div className="flex justify-center mt-4">
          <GoogleLoginButton />
        </div>
        {error && (
          <p className="text-red-700 text-center mt-4 font-bold">😢 {error}</p>
        )}
        {success && (
          <p className="text-green-700 text-center mt-4 font-bold">✅ {success}</p>
        )}
        <p className="mt-6 text-center text-xs text-gray-600">
          Already sold your soul to us?{' '}
          <a href="/login" className="underline text-blue-700">
            Log in instead.
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;


