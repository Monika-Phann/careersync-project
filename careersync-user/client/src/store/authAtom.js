// src/store/authAtom.js
import { atom } from 'jotai';

export const authAtom = atom({
  user: {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "student@example.com",
    avatar: "https://i.pravatar.cc/100"
  },
  token: "fake-developer-token",
  role: "student",
  isAuthenticated: true, // Set this to true manually
});