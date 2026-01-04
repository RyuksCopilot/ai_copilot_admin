import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  RefreshCcw,
  Info,
  Clock,
  AlertCircle,
} from "lucide-react";

const ICON_MAP = {
  upload: { icon: FileText, color: "bg-emerald-500", label: "PDF Upload" },
  process: { icon: RefreshCcw, color: "bg-blue-500", label: "Processing" },
  info: { icon: Info, color: "bg-slate-500", label: "System" },
  error: { icon: AlertCircle, color: "bg-red-500", label: "Error" },
};

const DUMMY_UPDATES = [
  {
    id: 1,
    type: "upload",
    title: "invoice_july.pdf uploaded",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    type: "process",
    title: "purchase_0412.pdf processed",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 3,
    type: "error",
    title: "gst_report.pdf failed to parse",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString();
};

export default function RecentUpdatesPanel() {
  const [updates, setUpdates] = useState(DUMMY_UPDATES);
  const [refreshing, setRefreshing] = useState(false);

  const grouped = useMemo(() => {
    const map = {};
    updates.forEach((u) => {
      const key = new Date(u.created_at).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(u);
    });
    return Object.entries(map);
  }, [updates]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <aside className="w-[360px] h-screen border-l border-slate-200 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-slate-800">Recent Updates</h3>
        <button
          onClick={handleRefresh}
          className="text-slate-500 hover:text-slate-700"
        >
          <RefreshCcw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* Summary */}
      <div className="px-4 py-2 text-xs text-slate-600 bg-emerald-50 border-b">
        {updates.length} activities in last 7 days
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        <AnimatePresence>
          {grouped.map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-2 px-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  {date === new Date().toDateString() ? "Today" : date}
                </span>
                <span className="flex-1 h-px bg-slate-100" />
              </div>

              {items.map((item) => {
                const cfg = ICON_MAP[item.type];
                const Icon = cfg.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition"
                  >
                    <div
                      className={`p-2 rounded-lg text-white ${cfg.color}`}
                    >
                      <Icon size={14} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {item.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100">
                          {cfg.label}
                        </span>
                        <span>•</span>
                        <Clock size={10} />
                        <span>{timeAgo(item.created_at)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </AnimatePresence>

        {!updates.length && (
          <p className="text-center text-sm text-slate-400">
            No recent updates yet.
          </p>
        )}
      </div>
    </aside>
  );
}
