"use client";
import Link from "next/link.js";
import { useRouter } from "next/navigation.js";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const info = await response.json();
    if (info.error) {
      return setError(info.error);
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div id="register-form-container" className="forms-container">
      <form id="register-form" className="forms" onSubmit={handleRegister}>
        <h1 id="register-title">Sign Up</h1>
        <p id="register-policy-agreement">
          By continuing, you agree to our User Agreement and acknowledge that
          you understand the Privacy Policy.
        </p>
        <div className="input-container">
          <input
            type="text"
            id="register-username-input"
            className="register-form-inputs"
            placeholder="username*"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            id="register-password-input"
            className="register-form-inputs"
            placeholder="password*"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <p id="register-already-a-redditor">
          Already a redditor?
          <Link id="register-to-login" href={"/login"}>
            Log In
          </Link>
        </p>
        <hr id="register-divider"></hr>
        <button type="submit" id="register-button">
          Sign Up
        </button>
      </form>
      <p>{error}</p>
    </div>
  );
}
