/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

// ---- Dummy auth backend (swap these for real API calls later) ----
export const DEMO_USER = { name: "Demo User", email: "demo@example.com", password: "password123" };

const USERS_KEY = "auth_users";
const SESSION_KEY = "auth_session";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function getUsers() {
  const users = read(USERS_KEY, []);
  // Demo account always exists
  return users.some((u) => u.email === DEMO_USER.email) ? users : [DEMO_USER, ...users];
}

export function defaultUsername(user) {
  return user.username || user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_.]/g, "");
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(SESSION_KEY, null));

  const PROFILE_FIELDS = ["name", "username", "bio", "website", "avatar"];

  function startSession(u) {
    const session = { token: `dummy-token-${Date.now()}`, email: u.email };
    PROFILE_FIELDS.forEach((k) => {
      if (u[k] !== undefined) session[k] = u[k];
    });
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  }

  async function login(email, password) {
    await delay(600);
    const found = getUsers().find((u) => u.email === email.trim().toLowerCase());
    if (!found || found.password !== password) throw new Error("Invalid email or password");
    return startSession(found);
  }

  async function register(name, email, password) {
    await delay(600);
    const users = getUsers();
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalized)) {
      throw new Error("An account with this email already exists");
    }
    const newUser = { name, email: normalized, password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return startSession(newUser);
  }

  async function forgotPassword() {
    await delay(600);
    // Always "succeeds" so we don't reveal which emails are registered.
  }

  async function updateProfile(changes) {
    await delay(500);
    const patch = {};
    PROFILE_FIELDS.forEach((k) => {
      if (changes[k] !== undefined) patch[k] = changes[k];
    });

    const users = getUsers();
    if (
      patch.username &&
      users.some((u) => u.email !== user.email && u.username === patch.username)
    ) {
      throw new Error("That username is already taken");
    }

    const exists = users.some((u) => u.email === user.email);
    const nextUsers = exists
      ? users.map((u) => (u.email === user.email ? { ...u, ...patch } : u))
      : users;
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

    const session = { ...user, ...patch };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, forgotPassword, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
