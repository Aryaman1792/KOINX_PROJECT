"use client";

import { useState } from "react";
import { formatCurrency, formatCurrencyExact } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Holding {
  id: string;
  asset: string;
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  stcg: { gain: number };
  ltcg: { gain: number };
}

interface HoldingsTableProps {
  holdings: Holding[];
  selectedHoldings: string[];
  onToggleSelection: (id: string) => void;
  onToggleAll: () => void;
}

export function HoldingsTable({
  holdings,
  selectedHoldings,
  onToggleSelection,
  onToggleAll,
}: HoldingsTableProps) {
  const [viewAll, setViewAll] = useState(false);
  const [sortCol, setSortCol] = useState<"stcg" | "ltcg" | null>(null);
  const [sortDesc, setSortDesc] = useState(true);

  // Track images that failed to load
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  let displayedHoldings = [...holdings];

  if (sortCol) {
    displayedHoldings.sort((a, b) => {
      const valA = sortCol === "stcg" ? a.stcg.gain : a.ltcg.gain;
      const valB = sortCol === "stcg" ? b.stcg.gain : b.ltcg.gain;
      return sortDesc ? valB - valA : valA - valB;
    });
  }

  if (!viewAll) {
    displayedHoldings = displayedHoldings.slice(0, 4);
  }

  const allSelected = holdings.length > 0 && selectedHoldings.length === holdings.length;

  const handleSort = (col: "stcg" | "ltcg") => {
    if (sortCol === col) {
      setSortDesc(!sortDesc);
    } else {
      setSortCol(col);
      setSortDesc(true);
    }
  };

  const handleImgError = (symbol: string) => {
    setImgErrorMap(prev => ({ ...prev, [symbol]: true }));
  };

  return (
    <div className="bg-[#121620] border border-[#1E2433] rounded-xl overflow-hidden mt-6">
      <div className="p-4 border-b border-[#1E2433]">
        <h3 className="text-[17px] font-semibold text-white">Holdings</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap min-w-[900px]">
          <thead className="text-[13px] text-slate-300 bg-[#0A0E17]/40 border-b border-[#1E2433]">
            <tr>
              <th className="p-4 w-14">
                <button
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${allSelected ? "bg-blue-600 border-blue-600" : "border-slate-500"
                    }`}
                  onClick={onToggleAll}
                >
                  {allSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </button>
              </th>
              <th className="py-4 px-2 font-medium">Asset</th>
              <th className="py-4 px-2 font-medium text-center">
                Holdings
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">Avg Buy Price</div>
              </th>
              <th className="py-4 px-2 font-medium text-center">Current Price</th>
              <th
                className="py-4 px-2 font-medium text-center cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort("stcg")}
              >
                <div className="flex items-center justify-center gap-1">
                  {sortCol === "stcg" && (
                    <span className="text-slate-400">{sortDesc ? "↓" : "↑"}</span>
                  )}
                  Short-Term
                </div>
              </th>
              <th
                className="py-4 px-2 font-medium text-center cursor-pointer hover:text-white transition-colors group"
                onClick={() => handleSort("ltcg")}
              >
                <div className="flex items-center justify-center gap-1">
                  {sortCol === "ltcg" && (
                    <span className="text-slate-400">{sortDesc ? "↓" : "↑"}</span>
                  )}
                  Long-Term
                </div>
              </th>
              <th className="py-4 px-4 font-medium text-center">Amount to Sell</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2433]">
            {displayedHoldings.map((holding) => {
              const isSelected = selectedHoldings.includes(holding.id);
              const imgError = imgErrorMap[holding.symbol];
              const iconUrl = `https://assets.coincap.io/assets/icons/${holding.symbol.toLowerCase()}@2x.png`;

              return (
                <tr
                  key={holding.id}
                  className={`transition-colors ${isSelected ? "bg-[#1E2433]/40" : "hover:bg-[#1E2433]/30"}`}
                >
                  <td className="p-4">
                    <button
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-500"
                        }`}
                      onClick={() => onToggleSelection(holding.id)}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </button>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      {!imgError ? (
                        <img
                          src={iconUrl}
                          alt={holding.asset}
                          className="w-8 h-8 rounded-full bg-white object-contain"
                          onError={() => handleImgError(holding.symbol)}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                          {holding.symbol.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{holding.asset}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{holding.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="font-medium text-white">{holding.quantity.toLocaleString(undefined, { maximumFractionDigits: 5 })} {holding.symbol}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{formatCurrency(holding.avgBuyPrice)}/{holding.symbol}</div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="group relative inline-block cursor-pointer">
                      <div className="font-medium text-white">{formatCurrency(holding.currentPrice)}</div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-white text-slate-900 text-[13px] font-medium py-1.5 px-3 rounded shadow-lg z-20">
                        {formatCurrencyExact(holding.currentPrice)}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[5px] border-transparent border-t-white"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className={`font-medium ${holding.stcg.gain > 0 ? "text-emerald-500" : holding.stcg.gain < 0 ? "text-rose-500" : "text-white"}`}>
                      <div className="group relative inline-block cursor-pointer">
                        {holding.stcg.gain > 0 ? "+" : ""}{formatCurrency(holding.stcg.gain)}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-white text-slate-900 text-[13px] font-medium py-1.5 px-3 rounded shadow-lg z-20">
                          {holding.stcg.gain > 0 ? "+" : ""}{formatCurrencyExact(holding.stcg.gain)}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[5px] border-transparent border-t-white"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{holding.quantity.toLocaleString(undefined, { maximumFractionDigits: 5 })} {holding.symbol}</div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className={`font-medium ${holding.ltcg.gain > 0 ? "text-emerald-500" : holding.ltcg.gain < 0 ? "text-rose-500" : "text-white"}`}>
                      <div className="group relative inline-block cursor-pointer">
                        {holding.ltcg.gain > 0 ? "+" : ""}{formatCurrency(holding.ltcg.gain)}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-white text-slate-900 text-[13px] font-medium py-1.5 px-3 rounded shadow-lg z-20">
                          {holding.ltcg.gain > 0 ? "+" : ""}{formatCurrencyExact(holding.ltcg.gain)}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[5px] border-transparent border-t-white"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{holding.ltcg.gain !== 0 ? holding.quantity.toLocaleString(undefined, { maximumFractionDigits: 5 }) : "0"} {holding.symbol}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {isSelected ? (
                      <span className="text-white font-medium">{holding.quantity.toLocaleString(undefined, { maximumFractionDigits: 5 })} {holding.symbol}</span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > 4 && (
        <div className="p-4 border-t border-[#1E2433]">
          <button
            onClick={() => setViewAll(!viewAll)}
            className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors"
          >
            {viewAll ? "View Less" : "View All"}
          </button>
        </div>
      )}
    </div>
  );
}
