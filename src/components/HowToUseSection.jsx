import { motion } from "framer-motion";

export default function HowToUseSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl"
    >
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        How to Use Ryuks Copilot
      </h1>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 space-y-6">
        <div>
          <h3 className="font-medium text-slate-700 mb-2">1. Upload PDF</h3>
          <p className="text-slate-600">
            Upload your accounting PDF such as invoices, bills, or GST reports.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-slate-700 mb-2">2. Process</h3>
          <p className="text-slate-600">
            Ryuks Copilot intelligently extracts voucher and ledger data.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-slate-700 mb-2">3. Review & Sync</h3>
          <p className="text-slate-600">
            Review generated entries and sync them directly to Tally.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
