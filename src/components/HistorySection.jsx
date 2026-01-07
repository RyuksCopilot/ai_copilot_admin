

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getHistoryByCompanyId } from "../lib/api/history";

/* Format date like: 07 Jan 2026 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function HistorySection() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistoryByCompanyId();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  /* Quick date filters */
  const applyQuickFilter = (days) => {
    const today = new Date();
    const from = new Date();

    from.setDate(today.getDate() - days);

    setFromDate(from.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
  };

  if (loading) {
    return <div className="text-slate-600">Loading history...</div>;
  }

  /* Apply date filter */
  const filteredHistory = history.filter((item) => {
    const itemDate = new Date(item.created_at);

    if (fromDate && itemDate < new Date(fromDate)) return false;
    if (toDate && itemDate > new Date(toDate)) return false;

    return true;
  });

  /* Group filtered history by title */
  const groupedHistory = filteredHistory.reduce((acc, item) => {
    if (!acc[item.title]) acc[item.title] = [];
    acc[item.title].push(item);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl space-y-6"
    >
      {/* Header */}
      <h1 className="text-2xl font-semibold text-slate-800">
        History
      </h1>

      {/* Date Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs text-slate-500 mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => applyQuickFilter(0)}
            className="px-3 py-2 text-sm border rounded-md hover:bg-slate-100"
          >
            Today
          </button>

          <button
            onClick={() => applyQuickFilter(7)}
            className="px-3 py-2 text-sm border rounded-md hover:bg-slate-100"
          >
            Last 7 Days
          </button>

          <button
            onClick={() => applyQuickFilter(30)}
            className="px-3 py-2 text-sm border rounded-md hover:bg-slate-100"
          >
            Last 30 Days
          </button>

          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="px-3 py-2 text-sm text-red-500 border border-red-200 rounded-md hover:bg-red-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Empty State */}
      {Object.keys(groupedHistory).length === 0 && (
        <div className="text-center py-10 text-slate-500">
          No history found for the selected date range.
        </div>
      )}

      {/* Dynamic Tables */}
      {Object.entries(groupedHistory).map(([title, entries]) => {
        const columns = Object.keys(entries[0].description || {});

        return (
          <div
            key={title}
            className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-700 capitalize">
                {title}
              </h2>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="text-left px-6 py-3 capitalize"
                    >
                      {col.replaceAll("_", " ")}
                    </th>
                  ))}
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {entries.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t odd:bg-white even:bg-slate-50"
                  >
                    {columns.map((col) => (
                      <td key={col} className="px-6 py-4">
                        {item.description[col]}
                      </td>
                    ))}

                    <td
                      className={`px-6 py-4 font-medium ${
                        item.status === "success"
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.status}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </motion.div>
  );
}
