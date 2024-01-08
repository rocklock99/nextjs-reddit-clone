"use client";
import Link from "next/link.js";
import { useRouter } from "next/navigation.js";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch("/api/users/login", {
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
    <div id="login-form-container" className="forms-container">
      <form id="login-form" className="forms" onSubmit={handleLogin}>
        <h1 id="login-title">Log In</h1>
        <p id="login-policy-agreement">
          By continuing, you agree to our User Agreement and acknowledge that
          you understand the Privacy Policy.
        </p>
        <div className="input-container">
          <input
            type="text"
            id="username"
            className="login-form-inputs"
            placeholder="username*"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            id="password"
            className="login-form-inputs"
            placeholder="password*"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <p id="login-new-to-reddit">
          New to Reddit?
          <Link id="navlink-to-register" href={"/register"}>
            Sign Up
          </Link>
        </p>
        <hr id="login-divider"></hr>
        <button type="submit" id="login-button">
          Log In
        </button>
      </form>
      <p>{error}</p>
    </div>
  );
}
