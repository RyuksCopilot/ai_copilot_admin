"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  RefreshCcw,
  Info,
  Clock,
  AlertCircle,
} from "lucide-react";
import { getHistoryByCompanyId } from "../lib/api/history";

/* Icon mapping */
const ICON_MAP = {
  "voucher created": {
    icon: FileText,
    color: "bg-emerald-500",
    label: "Voucher",
  },
  "ledger created": {
    icon: Info,
    color: "bg-blue-500",
    label: "Ledger",
  },
  error: {
    icon: AlertCircle,
    color: "bg-red-500",
    label: "Error",
  },
};

/* Time ago */
const timeAgo = (date) => {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

export default function RecentUpdatesPanel() {
  const [updates, setUpdates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const buildTitle = (item) => {
    const title = item.title.toLowerCase();

    if (title === "ledger created") {
      return `Ledger ${item.description?.ledger_name} created`;
    }

    if (title === "voucher created") {
      return `${item.description?.voucher_type} voucher created`;
    }

    return item.title;
  };

  const fetchUpdates = async () => {
    try {
      const data = await getHistoryByCompanyId();

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 7);

      const recent = data
        .filter(
          (item) => new Date(item.created_at) >= threeDaysAgo
        )
        .map((item) => {
          const key = item.title.toLowerCase();
          const cfg = ICON_MAP[key] || ICON_MAP.error;

          return {
            id: item.id,
            created_at: item.created_at,
            title: buildTitle(item),
            icon: cfg.icon,
            color: cfg.color,
            label: cfg.label,
          };
        });

      setUpdates(recent);
    } catch (err) {
      console.error("Failed to fetch recent updates", err);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    updates.forEach((u) => {
      const key = new Date(u.created_at).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(u);
    });
    return Object.entries(map);
  }, [updates]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUpdates();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <aside className="w-[360px] h-screen border-l border-slate-200 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-slate-800">
          Recent Updates
        </h3>
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
                  {date === new Date().toDateString()
                    ? "Today"
                    : date}
                </span>
                <span className="flex-1 h-px bg-slate-100" />
              </div>

              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition"
                  >
                    <div
                      className={`p-2 rounded-lg text-white ${item.color}`}
                    >
                      <Icon size={14} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {item.title}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100">
                          {item.label}
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
            No recent updates in last 3 days.
          </p>
        )}
      </div>
    </aside>
  );
}
