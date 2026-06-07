import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setError("");

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/admin");

    } catch (err) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 shadow-2xl"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          required
        />

        <button
          type="submit"
          className="w-full bg-white text-black font-bold py-3 rounded-lg hover:opacity-90 transition"
        >
          Login
        </button>

      </form>

    </div>
  );
}
