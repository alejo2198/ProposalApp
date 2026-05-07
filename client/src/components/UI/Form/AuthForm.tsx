import type { FormEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthFormProps {
  title: string;
  subtitle: string;
  error: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  loading: boolean;
  submitIdleText: string;
  submitLoadingText: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
  children: ReactNode;
}

export default function AuthForm({
  title,
  subtitle,
  error,
  onSubmit,
  loading,
  submitIdleText,
  submitLoadingText,
  footerText,
  footerLinkText,
  footerLinkTo,
  children,
}: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 text-sm mb-6">{subtitle}</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition"
          >
            {loading ? submitLoadingText : submitIdleText}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          {footerText}{" "}
          <Link to={footerLinkTo} className="text-blue-600 hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
