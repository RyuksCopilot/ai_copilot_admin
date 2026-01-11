// import { useState } from "react";
// import { Upload, FileText } from "lucide-react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { uploadPdf } from "../lib/api/pdf_process.js";
// import { getLedgers,createLedger ,createVoucher} from "../lib/api/ledgers.js";
// import { createHistoryBulk } from "../lib/api/history.js";
// import { data } from "react-router-dom";

// export default function ToolSection() {
//   const [file, setFile] = useState(null);
//   const [processing, setProcessing] = useState(false);

//   const handleProcess = async (async) => {
//     if (!file) {
//       toast.error("Please upload a PDF file");
//       return;
//     }

//    const data = await uploadPdf(file);

//     // Step 1: Extract ledgers from PDF response
//     const from_ledgers = [];
//     const to_ledgers = [];

//     for (let i = 0; i < data.length; i++) {
//       if (data[i]?.from_ledger) from_ledgers.push(data[i].from_ledger);
//       if (data[i]?.to_ledger) to_ledgers.push(data[i].to_ledger);
//     }

//     // Step 2: Get existing ledgers
//     const existingLedgers = await getLedgers();

//     // Step 3: Convert existing ledgers to a Set (FAST lookup)
//     const existingLedgerSet = new Set(
//       existingLedgers.data.ledgers.map((l) => l.ledger_name)
//     );

//     // Step 4: Filter only NEW ledgers
//     const newFromLedgers = from_ledgers.filter(
//       (ledger) => !existingLedgerSet.has(ledger)
//     );

//     const newToLedgers = to_ledgers.filter(
//       (ledger) => !existingLedgerSet.has(ledger)
//     );

//     console.log("New From Ledgers:", newFromLedgers);
//     console.log("New To Ledgers:", newToLedgers);
//     const from_ledgers_des = []

//     for (let i = 0; i < newFromLedgers.length; i++) {
//       await createLedger(newFromLedgers[i], "Bank Accounts");
//       from_ledgers_des.push({"title":"ledger created","description":{"ledger_name": newFromLedgers[i],"group_name":"Bank Accounts"},"status":"success"});
//     }
//     if(from_ledgers_des.length>0){
//       const result = await createHistoryBulk(from_ledgers_des);
//     }
    
//     const to_ledgers_des = []

//     for (let i = 0; i < newToLedgers.length; i++) {
//       await createLedger(newToLedgers[i], "Sundry Creditors");
//       to_ledgers_des.push({"title":"ledger created","description":{"ledger_name": newToLedgers[i],"group_name":"Sundry Creditors"},"status":"success"});
//     }

    
//     console.log("PDF Processing Result:", data);
//     const vouchers_des = []
//     for (let i = 0; i < data.length; i++) {
//       if(data[i]['amount']>0){
//         await createVoucher(data[i]['from_ledger'], data[i]['to_ledger'], data[i]['amount'],"Payment", data[i]['date'],"no");
//         vouchers_des.push({"title":"voucher created","description":{"voucher_type": "Payment","from_ledger":data[i]['from_ledger'],"to_ledger":data[i]['to_ledger'],"amount":data[i]['amount']},"status":"success"});
//       }
//       else{
//         await createVoucher(data[i]['from_ledger'], data[i]['to_ledger'], Math.abs(data[i]['amount']),"Receipt", data[i]['date'],"no");
//         vouchers_des.push({"title":"voucher created","description":{"voucher_type": "Receipt","from_ledger":data[i]['from_ledger'],"to_ledger":data[i]['to_ledger'],"amount":Math.abs(data[i]['amount'])},"status":"success"});
//       }
//     }

//         if(vouchers_des.length>0){
//       const result = await createHistoryBulk(vouchers_des);
//     }

//     setProcessing(true);
//     setTimeout(() => {
//       setProcessing(false);
//       toast.success("PDF processed successfully");
//     }, 1500);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-2xl w-full"
//     >
//       <h1 className="text-2xl font-semibold text-slate-800 mb-2">
//         PDF to Tally Processor
//       </h1>
//       <p className="text-slate-600 mb-6">
//         Upload accounting PDFs and automatically generate structured Tally
//         entries.
//       </p>

//       <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
//         <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-xl p-8 cursor-pointer hover:bg-emerald-50 transition">
//           <Upload className="text-emerald-600 mb-2" />
//           <span className="text-sm text-slate-600">
//             {file ? file.name : "Click to upload PDF"}
//           </span>
//           <input
//             type="file"
//             accept="application/pdf"
//             className="hidden"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//         </label>

//         <button
//           onClick={handleProcess}
//           disabled={processing}
//           className="mt-6 w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2"
//         >
//           {processing ? "Processing PDF..." : <><FileText size={18} /> Process PDF</>}
//         </button>
//       </div>
//     </motion.div>
//   );
// }

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { uploadPdf } from "../lib/api/pdf_process.js";
import { getLedgers, createLedger, createVoucher } from "../lib/api/ledgers.js";
import { createHistoryBulk } from "../lib/api/history.js";

/* -------------------- Helpers -------------------- */

const sleep = (ms = 1000) => new Promise((res) => setTimeout(res, ms));

const INITIAL_PROGRESS = {
  upload: { label: "Uploading PDF", current: 0, total: 1 },
  extract: { label: "Extracting data", current: 0, total: 1 },
  ledgers: { label: "Creating ledgers", current: 0, total: 0 },
  vouchers: { label: "Creating vouchers", current: 0, total: 0 },
};

export default function ToolSection() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);

  const incrementProgress = (key) => {
    setProgress((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        current: prev[key].current + 1,
      },
    }));
  };

  const setTotal = (key, total) => {
    setProgress((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        total,
      },
    }));
  };

  const percent = (step) =>
    step.total === 0 ? 0 : Math.round((step.current / step.total) * 100);

  /* -------------------- Main Flow -------------------- */

  const handleProcess = async () => {
    if (!file) {
      toast.error("Please upload a PDF file");
      return;
    }

    try {
      setProcessing(true);
      setProgress(INITIAL_PROGRESS);

      /* STEP 1: Upload PDF */
      const data = await uploadPdf(file);
      incrementProgress("upload");
      await sleep();

      /* STEP 2: Extract data */
      const from_ledgers = [];
      const to_ledgers = [];

      data.forEach((item) => {
        if (item?.from_ledger) from_ledgers.push(item.from_ledger);
        if (item?.to_ledger) to_ledgers.push(item.to_ledger);
      });

      incrementProgress("extract");
      await sleep();

      /* STEP 3: Create Ledgers */
      const existingLedgers = await getLedgers();
      const existingLedgerSet = new Set(
        existingLedgers.data.ledgers.map((l) => l.ledger_name)
      );

      const newFromLedgers = from_ledgers.filter(
        (l) => !existingLedgerSet.has(l)
      );
      const newToLedgers = to_ledgers.filter(
        (l) => !existingLedgerSet.has(l)
      );

      const totalLedgers = newFromLedgers.length + newToLedgers.length;
      setTotal("ledgers", totalLedgers);

      const ledgerHistory = [];

      for (const ledger of newFromLedgers) {
        await createLedger(ledger, "Bank Accounts");
        ledgerHistory.push({
          title: "Ledger created",
          description: { ledger_name: ledger, group_name: "Bank Accounts" },
          status: "success",
        });

        incrementProgress("ledgers");
        await sleep();
      }

      for (const ledger of newToLedgers) {
        await createLedger(ledger, "Sundry Creditors");
        ledgerHistory.push({
          title: "Ledger created",
          description: {
            ledger_name: ledger,
            group_name: "Sundry Creditors",
          },
          status: "success",
        });

        incrementProgress("ledgers");
        await sleep();
      }

      if (ledgerHistory.length) {
        await createHistoryBulk(ledgerHistory);
      }

      /* STEP 4: Create Vouchers */
      setTotal("vouchers", data.length);

      const voucherHistory = [];

      for (const item of data) {
        const amount = Math.abs(item.amount);
        const type = item.amount > 0 ? "Payment" : "Receipt";

        if(type==="Payment"){
          await createVoucher(
          item.from_ledger,
          item.to_ledger,
          amount,
          type,
          item.date,
          "no"
        );
        }
        else{
         await createVoucher(
          item.to_ledger,
          item.from_ledger,
          amount,
          type,
          item.date,
          "no"
        );
        }
        

        voucherHistory.push({
          title: "Voucher created",
          description: {
            voucher_type: type,
            from_ledger: item.from_ledger,
            to_ledger: item.to_ledger,
            amount,
          },
          status: "success",
        });

        incrementProgress("vouchers");
        await sleep();
      }

      if (voucherHistory.length) {
        await createHistoryBulk(voucherHistory);
      }

      toast.success("PDF processed successfully 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Error while processing PDF");
    } finally {
      setProcessing(false);
    }
  };

  /* -------------------- UI -------------------- */

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
        Upload accounting PDFs and generate structured Tally entries.
      </p>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 space-y-6">
        {/* Upload */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-xl p-8 cursor-pointer hover:bg-emerald-50 transition">
          <Upload className="text-emerald-600 mb-2" />
          <span className="text-sm text-slate-600">
            {file ? file.name : "Click to upload PDF"}
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={processing}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {/* Progress */}
        {processing && (
          <div className="space-y-4">
            {Object.entries(progress).map(([key, step]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{step.label}</span>
                  <span>
                    {step.current}/{step.total}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-600"
                    animate={{ width: `${percent(step)}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleProcess}
          disabled={processing}
          className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2"
        >
          {processing ? "Processing..." : (
            <>
              <FileText size={18} />
              Process PDF
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
