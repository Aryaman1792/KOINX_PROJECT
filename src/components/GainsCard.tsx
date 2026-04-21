import { formatCurrencyExact } from "@/lib/utils";

interface GainsCardProps {
  title: string;
  theme: "dark" | "blue";
  stcgProfits: number;
  stcgLosses: number;
  ltcgProfits: number;
  ltcgLosses: number;
  netStcg: number;
  netLtcg: number;
  effectiveGains: number;
  savingsAmount?: number;
}

export function GainsCard({
  title,
  theme,
  stcgProfits,
  stcgLosses,
  ltcgProfits,
  ltcgLosses,
  netStcg,
  netLtcg,
  effectiveGains,
  savingsAmount,
}: GainsCardProps) {
  const isBlue = theme === "blue";
  
  const containerClass = isBlue 
    ? "bg-blue-500 text-white border-blue-500" 
    : "bg-[#121620] border-[#1E2433] text-white";
    
  const textMuted = isBlue ? "text-blue-100" : "text-slate-400";
  const borderClass = isBlue ? "border-white/20" : "border-[#1E2433]";

  return (
    <div className={`p-6 rounded-xl border ${containerClass} flex flex-col h-full`}>
      <h3 className="text-[17px] font-semibold mb-6">{title}</h3>
      
      <div className="grid grid-cols-3 gap-y-4 gap-x-2 mb-6">
        <div></div>
        <div className={`text-right text-sm font-medium ${textMuted}`}>Short-term</div>
        <div className={`text-right text-sm font-medium ${textMuted}`}>Long-term</div>
        
        <div className={`text-[15px] font-medium ${textMuted}`}>Profits</div>
        <div className="text-right text-[15px] font-medium">{formatCurrencyExact(stcgProfits)}</div>
        <div className="text-right text-[15px] font-medium">{formatCurrencyExact(ltcgProfits)}</div>
        
        <div className={`text-[15px] font-medium ${textMuted}`}>Losses</div>
        <div className="text-right text-[15px] font-medium">{formatCurrencyExact(stcgLosses)}</div>
        <div className="text-right text-[15px] font-medium">{formatCurrencyExact(ltcgLosses)}</div>
        
        <div className={`text-[15px] font-medium pt-2 ${textMuted}`}>Net Capital Gains</div>
        <div className="text-right text-[15px] font-medium pt-2">{formatCurrencyExact(netStcg)}</div>
        <div className="text-right text-[15px] font-medium pt-2">{formatCurrencyExact(netLtcg)}</div>
      </div>
      
      <div className="mt-auto">
        <div className={`pt-6 border-t ${borderClass} flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
          <div className="font-semibold text-lg">
            {!isBlue ? "Realised Capital Gains:" : "Effective Capital Gains:"}
          </div>
          <div className="font-bold text-2xl">
            {formatCurrencyExact(effectiveGains)}
          </div>
        </div>

        {/* Savings Banner for After Harvesting card */}
        {isBlue && savingsAmount !== undefined && savingsAmount > 0 && (
          <div className="mt-6 flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span className="text-[13px] font-medium text-white">You are going to save upto {formatCurrencyExact(savingsAmount)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
