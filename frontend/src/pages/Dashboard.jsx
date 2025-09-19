import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) navigate("/login");
    else setUser(JSON.parse(userData));
  }, [navigate]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Welcome to the Sweet Shop 🍬</h2>
      {user && (
        <p className="mt-4">
          Logged in as <span className="font-semibold">{user.email}</span> ({user.role})
        </p>
      )}
    </div>
  );
}
