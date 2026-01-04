import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { uploadPdf } from "../lib/api/pdf_process.js";
import { getLedgers,createLedger } from "../lib/api/ledgers.js";
import { createHistoryBulk } from "../lib/api/history.js";
import { data } from "react-router-dom";

export default function ToolSection() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleProcess = async (async) => {
    if (!file) {
      toast.error("Please upload a PDF file");
      return;
    }

   const data = await uploadPdf(file);

    // Step 1: Extract ledgers from PDF response
    const from_ledgers = [];
    const to_ledgers = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i]?.from_ledger) from_ledgers.push(data[i].from_ledger);
      if (data[i]?.to_ledger) to_ledgers.push(data[i].to_ledger);
    }

    // Step 2: Get existing ledgers
    const existingLedgers = await getLedgers();

    // Step 3: Convert existing ledgers to a Set (FAST lookup)
    const existingLedgerSet = new Set(
      existingLedgers.data.ledgers.map((l) => l.ledger_name)
    );

    // Step 4: Filter only NEW ledgers
    const newFromLedgers = from_ledgers.filter(
      (ledger) => !existingLedgerSet.has(ledger)
    );

    const newToLedgers = to_ledgers.filter(
      (ledger) => !existingLedgerSet.has(ledger)
    );

    console.log("New From Ledgers:", newFromLedgers);
    console.log("New To Ledgers:", newToLedgers);
    const from_ledgers_des = []

    for (let i = 0; i < newFromLedgers.length; i++) {
      await createLedger(newFromLedgers[i], "Bank Accounts");
      from_ledgers_des.push({"title":"ledger created","description":{"ledger_name": newFromLedgers[i],"group_name":"Bank Accounts"},"status":"success"});
    }

    const result = await createHistoryBulk(from_ledgers_des);

    const to_ledgers_des = []

    for (let i = 0; i < newToLedgers.length; i++) {
      await createLedger(newToLedgers[i], "Sundry Creditors");
      to_ledgers_des.push({"title":"ledger created","description":{"ledger_name": newToLedgers[i],"group_name":"Sundry Creditors"},"status":"success"});
    }

    const result2 = await createHistoryBulk(to_ledgers_des);

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast.success("PDF processed successfully");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full"
    >
      <h1 className="text-2xl font-semibold text-slate-800 mb-2">
        PDF to Tally Processor
      </h1>
      <p className="text-slate-600 mb-6">
        Upload accounting PDFs and automatically generate structured Tally
        entries.
      </p>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-xl p-8 cursor-pointer hover:bg-emerald-50 transition">
          <Upload className="text-emerald-600 mb-2" />
          <span className="text-sm text-slate-600">
            {file ? file.name : "Click to upload PDF"}
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button
          onClick={handleProcess}
          disabled={processing}
          className="mt-6 w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2"
        >
          {processing ? "Processing PDF..." : <><FileText size={18} /> Process PDF</>}
        </button>
      </div>
    </motion.div>
  );
}
