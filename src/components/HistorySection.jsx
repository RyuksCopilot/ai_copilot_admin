import { motion } from "framer-motion";

const HISTORY = [
  { name: "invoice_july.pdf", status: "Processed", date: "2026-01-01" },
  { name: "purchase_0412.pdf", status: "Processed", date: "2025-12-28" },
  { name: "gst_report.pdf", status: "Failed", date: "2025-12-25" },
];

export default function HistorySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl"
    >
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Processing History
      </h1>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="text-left px-6 py-3">File</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-6 py-4">{item.name}</td>
                <td
                  className={`px-6 py-4 font-medium ${
                    item.status === "Processed"
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {item.status}
                </td>
                <td className="px-6 py-4 text-slate-500">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
