import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import api from "../api/axios.ts";
import AuthForm from "../components/UI/Form/AuthForm.tsx";
import FormGroup from "../components/UI/Form/FormGroup.tsx";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Buyer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/register", form);
      login(data);
      navigate("/");
    } catch {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create account"
      subtitle="Join PropFlow today"
      error={error}
      onSubmit={handleSubmit}
      loading={loading}
      submitIdleText="Create account"
      submitLoadingText="Creating account..."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <FormGroup
        id="fullName"
        label="Full Name"
        type="text"
        required
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />
      <FormGroup
        id="email"
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <FormGroup
        id="password"
        label="Password"
        type="password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <div>
        <label
          htmlFor="role"
          className="text-sm font-medium text-gray-700 block mb-1"
        >
          I am a...
        </label>
        <select
          id="role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Buyer">Buyer</option>
          <option value="Agent">Agent</option>
        </select>
      </div>
    </AuthForm>
  );
}
