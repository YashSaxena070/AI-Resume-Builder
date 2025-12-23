import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, getProfile } from "../../redux/userSlice";
import { BASE_URL, API_PATHS } from "../../utils/apiPaths";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from "axios";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = searchParams.get("token");
    const email = searchParams.get("email"); // Optional, for display if needed

    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid verification link.");
                return;
            }

            try {
                // Call backend to verify
                const response = await axios.get(`${BASE_URL}${API_PATHS.AUTH.VERIFY_EMAIL}?token=${token}`);

                // If successful, backend returns AuthResponse with token
                const { token: jwtToken } = response.data;

                if (jwtToken) {
                    dispatch(setToken(jwtToken));
                    await dispatch(getProfile()).unwrap();
                    setStatus("success");
                    setMessage("Email verified successfully! Redirecting...");

                    // Auto redirect after 2 seconds
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 2000);
                } else {
                    // Fallback if no token returned (old backend behavior?)
                    setStatus("success");
                    setMessage("Email verified! Please login.");
                }

            } catch (err) {
                console.error("Verification failed", err);
                setStatus("error");
                setMessage(err.response?.data?.message || "Verification failed. Link may be expired.");
            }
        };

        verify();
    }, [token, dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">

                {status === "verifying" && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                        <h2 className="text-2xl font-bold text-slate-800">Verifying Email</h2>
                        <p className="text-slate-500">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                        <h2 className="text-2xl font-bold text-slate-800">Verified!</h2>
                        <p className="text-slate-600">{message}</p>
                        <Link to="/dashboard" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Go to Dashboard
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                        <h2 className="text-2xl font-bold text-slate-800">Verification Failed</h2>
                        <p className="text-red-500">{message}</p>
                        <Link to="/login" className="mt-4 px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                            Back to Login
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;
