import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();


// const handleLogin = async (e) => {
//   e.preventDefault();
//   // setLoading(true);
//   // setError("");

//   try {
//     const response = await axios.post(
//       `https://ai-copilot-api-call-server.onrender.com/api/v1/company/verification/${password}`,
//       {},
//       {
//         headers: {
//           accept: "application/json",
//         },
//       }
//     );
//     console.log("Login response:", response.data['company']['company_name']);
//     if (response.data) {
//       // Store auth (can store token / user later)
//       localStorage.setItem("is_auth", "true");
//       localStorage.setItem(
//         "auth_data",
//         JSON.stringify(response.data['company'])
//       );

      
      
//       if (response.data['company'] && response.data['company']['company_name']==username) {
//         toast.success(`Welcome ${response.data['company']['company_name']} `, {
//         description: "Tally automation portal is ready",
//       });
//         navigate("/dashboard");
//       }
//       else{
//         setError("Invalid username or password");
//       }

//     } else {
//       setError("Verification failed");
//     }
//   } catch (err) {
//     console.error("Login error:", err);

//     setError(
//       err?.response?.data?.detail ||
//       err?.response?.data?.message ||
//       "Invalid credentials or server error"
//     );

//     toast.error("Login failed", {
//       description: "Unable to verify credentials",
//     });
//   } finally {
//     setLoading(false);
//   }
// };
  

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch(
      `https://ai-copilot-api-call-server.onrender.com/api/v1/company/verification/${password}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.detail || "Login failed");
    }

    const data = await res.json();

    if (
      data?.company &&
      data.company.company_name === username
    ) {
      localStorage.setItem("is_auth", "true");
      localStorage.setItem("auth_data", JSON.stringify(data.company));

      toast.success(`Welcome ${data.company.company_name}`, {
        description: "Tally automation portal is ready",
      });

      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  } catch (err) {
    console.error(err);
    setError(err.message || "Server error");
    toast.error("Login failed", {
      description: "Unable to verify credentials",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-md p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-emerald-100 shadow-xl"
    >
      {/* Decorative blur */}
      <div className="absolute -top-10 -left-12 w-40 h-40 bg-emerald-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -right-12 w-40 h-40 bg-green-400/20 rounded-full blur-3xl" />

      {/* Title */}
      <h2 className="text-2xl font-semibold text-emerald-700 text-center mb-2">
        Client Login
      </h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        Access your client dashboard
      </p>

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Username */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Username</label>
          <div
            className={`relative rounded-xl transition-all ${
              focused === "username"
                ? "shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
                : ""
            }`}
          >
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
            />
            <input
              className="w-full h-11 pl-10 rounded-xl bg-white/80 border border-gray-200 focus:outline-none"
              placeholder="Enter username"
              value={username}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Password</label>
          <div
            className={`relative rounded-xl transition-all ${
              focused === "password"
                ? "shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
                : ""
            }`}
          >
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
            />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/80 border border-gray-200 focus:outline-none"
              placeholder="Enter password"
              value={password}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
            >
              <AnimatePresence mode="wait">
                {showPassword ? (
                  <motion.div
                    key="off"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                  >
                    <EyeOff size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="on"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                  >
                    <Eye size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}

        {/* Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <motion.span
              animate={{ opacity: [0.6, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Logging in...
            </motion.span>
          ) : (
            <>
              <LogIn size={18} />
              Login
            </>
          )}
        </motion.button>
      </form>

      {/* <div className="text-center mt-4">
        <a href="#" className="text-sm text-emerald-700 hover:underline">
          Forgot Password?
        </a>
      </div> */}
    </motion.div>
  );
}
