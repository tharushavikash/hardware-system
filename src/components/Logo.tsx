import { Database } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-white">
      <div className="rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-1.5 shadow-lg shadow-amber-900/30">
        <Database size={20} strokeWidth={2.5} />
      </div>
      <span className="text-lg font-extrabold tracking-tight">
        HARD<span className="text-amber-300">WARE</span> POS
      </span>
    </div>
  );
}
