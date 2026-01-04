import { motion } from "framer-motion";
import LoginCard from "../components/LoginCard";
import AnimatedBackground from "../components/AnimatedBackground";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-inter bg-slate-50">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-11/12 max-w-6xl gap-10 px-6 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-emerald-700 mb-4 leading-snug">
            Welcome to <br /> Ryuks Copilot
          </h1>
          <p className="text-slate-600 text-lg max-w-md">
             Automate Tally entries, manage vouchers, ledgers, and compliance with speed,
  accuracy, and complete control and all from one intelligent dashboard.
          </p>
        </motion.div>

        {/* Right */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <LoginCard />
        </motion.div>
      </motion.div>
    </div>
  );
}
