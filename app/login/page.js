"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      // ✅ FIX: role comes from data.user.role
      const role = data.user?.role?.toLowerCase() || "guest";

      // ✅ Save token
      Cookies.set("token", data.token, {
        expires: 1,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      });

      // ✅ Save role
      Cookies.set("role", role, { expires: 1 });

      // ✅ Trigger UI updates (if navbar depends on role)
      window.dispatchEvent(new Event("roleChanged"));

      toast.success("✅ Login successful!");

      // ✅ Redirect based on role
      if (role === "admin") {
        router.push("/admin"); // change if needed
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <a href="/page/register" className="text-green-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
