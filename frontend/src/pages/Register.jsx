import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form.name, form.email, form.password, form.role);
      navigate("/login");
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="w-full border px-3 py-2 rounded-lg mb-4"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded-lg mb-4"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded-lg mb-4"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full border px-3 py-2 rounded-lg mb-4"
          value={form.role}
          onChange={handleChange}
        >
          <option value="ROLE_USER">User</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
