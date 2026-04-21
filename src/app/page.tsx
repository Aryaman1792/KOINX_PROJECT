"use client";

import { useState, useMemo, useEffect } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { GainsCard } from "@/components/GainsCard";
import { HoldingsTable, type Holding } from "@/components/HoldingsTable";

// Match exact values from screenshot for Pre Harvesting
const INITIAL_GAINS = {
  stcg: { profits: 4049.48, losses: 32127.03 },
  ltcg: { profits: 0, losses: 0 }
};

const MOCK_HOLDINGS: Holding[] = [
  {
    id: "wbtc",
    asset: "Wrapped Bitcoin",
    symbol: "WBTC",
    quantity: 2218.81,
    avgBuyPrice: 92980.19,
    currentPrice: 104390,
    stcg: { gain: 25310000 },
    ltcg: { gain: 0 }
  },
  {
    id: "btc",
    asset: "Bitcoin",
    symbol: "BTC",
    quantity: 1184.12,
    avgBuyPrice: 93072.64,
    currentPrice: 104250,
    stcg: { gain: 13240000 },
    ltcg: { gain: 0 }
  },
  {
    id: "matic",
    asset: "Polygon",
    symbol: "MATIC",
    quantity: 26038.45,
    avgBuyPrice: 0.13,
    currentPrice: 0.26,
    stcg: { gain: 3348.92 },
    ltcg: { gain: 0 }
  },
  {
    id: "mkr",
    asset: "Maker",
    symbol: "MKR",
    quantity: 5.94,
    avgBuyPrice: 1501.81,
    currentPrice: 1866.63,
    stcg: { gain: 2167.04 },
    ltcg: { gain: 0 }
  },
  {
    id: "eth",
    asset: "Ethereum",
    symbol: "ETH",
    quantity: 5.6736,
    avgBuyPrice: 1620.15,
    currentPrice: 1643.43,
    stcg: { gain: 55320.15 },
    ltcg: { gain: 8239.29 }
  },
  {
    id: "usdt1",
    asset: "Tether",
    symbol: "USDT",
    quantity: 3096.54,
    avgBuyPrice: 1.15,
    currentPrice: 1.01,
    stcg: { gain: -1200 },
    ltcg: { gain: 2400 }
  },
  {
    id: "sol",
    asset: "Solana",
    symbol: "SOL",
    quantity: 145.5,
    avgBuyPrice: 85.20,
    currentPrice: 142.60,
    stcg: { gain: 8351.70 },
    ltcg: { gain: 0 }
  },
  {
    id: "ada",
    asset: "Cardano",
    symbol: "ADA",
    quantity: 15400,
    avgBuyPrice: 0.85,
    currentPrice: 0.45,
    stcg: { gain: -6160 },
    ltcg: { gain: 0 }
  },
  {
    id: "dot",
    asset: "Polkadot",
    symbol: "DOT",
    quantity: 850,
    avgBuyPrice: 18.50,
    currentPrice: 6.80,
    stcg: { gain: 0 },
    ltcg: { gain: -9945 }
  },
  {
    id: "xrp",
    asset: "Ripple",
    symbol: "XRP",
    quantity: 5000,
    avgBuyPrice: 0.55,
    currentPrice: 0.61,
    stcg: { gain: 300 },
    ltcg: { gain: 0 }
  },
  {
    id: "doge",
    asset: "Dogecoin",
    symbol: "DOGE",
    quantity: 25000,
    avgBuyPrice: 0.08,
    currentPrice: 0.15,
    stcg: { gain: 1750 },
    ltcg: { gain: 0 }
  },
  {
    id: "link",
    asset: "Chainlink",
    symbol: "LINK",
    quantity: 350,
    avgBuyPrice: 12.40,
    currentPrice: 18.20,
    stcg: { gain: 0 },
    ltcg: { gain: 2030 }
  }
];

export default function TaxOptimisationPage() {
  const [loading, setLoading] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedHoldings, setSelectedHoldings] = useState<string[]>([]);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setHoldings(MOCK_HOLDINGS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Base computations
  const preStcgNet = INITIAL_GAINS.stcg.profits - INITIAL_GAINS.stcg.losses;
  const preLtcgNet = INITIAL_GAINS.ltcg.profits - INITIAL_GAINS.ltcg.losses;
  const preEffectiveGains = preStcgNet + preLtcgNet;

  // Derived computations based on selection
  const afterGains = useMemo(() => {
    let newStcgProfits = INITIAL_GAINS.stcg.profits;
    let newStcgLosses = INITIAL_GAINS.stcg.losses;
    let newLtcgProfits = INITIAL_GAINS.ltcg.profits;
    let newLtcgLosses = INITIAL_GAINS.ltcg.losses;

    holdings.forEach(holding => {
      if (selectedHoldings.includes(holding.id)) {
        if (holding.stcg.gain > 0) newStcgProfits += holding.stcg.gain;
        else newStcgLosses += Math.abs(holding.stcg.gain);

        if (holding.ltcg.gain > 0) newLtcgProfits += holding.ltcg.gain;
        else newLtcgLosses += Math.abs(holding.ltcg.gain);
      }
    });

    const netStcg = newStcgProfits - newStcgLosses;
    const netLtcg = newLtcgProfits - newLtcgLosses;

    return {
      stcgProfits: newStcgProfits,
      stcgLosses: newStcgLosses,
      ltcgProfits: newLtcgProfits,
      ltcgLosses: newLtcgLosses,
      netStcg,
      netLtcg,
      effectiveGains: netStcg + netLtcg
    };
  }, [holdings, selectedHoldings]);

  const savings = preEffectiveGains > afterGains.effectiveGains 
    ? preEffectiveGains - afterGains.effectiveGains 
    : 0;

  const handleToggleSelection = (id: string) => {
    setSelectedHoldings(prev => 
      prev.includes(id) ? prev.filter(hId => hId !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (selectedHoldings.length === holdings.length) {
      setSelectedHoldings([]);
    } else {
      setSelectedHoldings(holdings.map(h => h.id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans">
      {/* Top Banner exactly as screenshot */}
      <div className="bg-[#151924] w-full px-6 py-4 flex items-center mb-6">
        <div className="flex items-center gap-1 font-bold text-xl tracking-tight">
          <span className="text-blue-500">Koin</span>
          <span className="text-[#FF9500]">X</span>
          <span className="text-[10px] text-white/50 align-top mt-1 ml-0.5 border border-white/20 rounded-full px-1">R</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto space-y-6 px-4 md:px-8 pb-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Tax Harvesting</h1>
          <div className="group relative">
            <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors underline underline-offset-4">
              How it works?
            </button>
            <div className="absolute top-full left-0 mt-2 w-[340px] bg-white text-slate-800 text-sm rounded-lg shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
              <div className="absolute bottom-full left-6 -mb-[1px] border-[6px] border-transparent border-b-white"></div>
              <ul className="list-disc pl-4 space-y-1 mb-3">
                <li>See your capital gains for FY 2024-25 in the left card</li>
                <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
                <li>Instantly see your updated tax liability in the right card</li>
              </ul>
              <p><strong>Pro tip:</strong> Experiment with different combinations of your holdings to optimize your tax liability</p>
            </div>
          </div>
        </div>

        {/* Disclaimer Accordion (Blue layout matching exact screenshot) */}
        <div className="bg-[#0D1528] border border-[#1E3A8A] rounded-lg overflow-hidden">
          <button 
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#121B31] transition-colors"
            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <span className="font-semibold text-[15px] text-white">Important Notes & Disclaimers</span>
            </div>
            {disclaimerOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {disclaimerOpen && (
            <div className="px-12 pb-5 pt-1 text-[13px] text-white/90">
              <ul className="list-disc space-y-2 marker:text-white">
                <li>Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</li>
                <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</li>
                <li>Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</li>
                <li>Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.</li>
                <li>Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <GainsCard 
            title="Pre Harvesting"
            theme="dark"
            stcgProfits={INITIAL_GAINS.stcg.profits}
            stcgLosses={INITIAL_GAINS.stcg.losses}
            ltcgProfits={INITIAL_GAINS.ltcg.profits}
            ltcgLosses={INITIAL_GAINS.ltcg.losses}
            netStcg={preStcgNet}
            netLtcg={preLtcgNet}
            effectiveGains={preEffectiveGains}
          />
          <GainsCard 
            title="After Harvesting"
            theme="blue"
            stcgProfits={afterGains.stcgProfits}
            stcgLosses={afterGains.stcgLosses}
            ltcgProfits={afterGains.ltcgProfits}
            ltcgLosses={afterGains.ltcgLosses}
            netStcg={afterGains.netStcg}
            netLtcg={afterGains.netLtcg}
            effectiveGains={afterGains.effectiveGains}
            savingsAmount={savings}
          />
        </div>

        {/* Holdings Table */}
        <HoldingsTable 
          holdings={holdings}
          selectedHoldings={selectedHoldings}
          onToggleSelection={handleToggleSelection}
          onToggleAll={handleToggleAll}
        />
        
      </div>
    </div>
  );
}
