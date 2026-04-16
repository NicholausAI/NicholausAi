"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, DollarSign, Clock, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { EmailForm } from "@/components/email/EmailForm";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(75);
  const [toolSpend, setToolSpend] = useState("500");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const calculations = useMemo(() => {
    const toolSpendNum = parseFloat(toolSpend) || 0;
    const annualLaborCost = hoursPerWeek * hourlyCost * 52;
    const annualSavings = annualLaborCost * 0.7;
    const annualToolSavings = toolSpendNum * 12 * 0.3;
    const totalAnnualSavings = annualSavings + annualToolSavings;
    const estimatedInvestment = totalAnnualSavings * 0.15;
    const monthlyROI =
      estimatedInvestment > 0
        ? (totalAnnualSavings / 12 / (estimatedInvestment / 12))
        : 0;

    // Monthly savings growth over 12 months (ramp-up factor)
    const monthlySavings = Array.from({ length: 12 }, (_, i) => {
      const rampUp = Math.min(1, (i + 1) / 3); // Full efficiency at month 3
      return (totalAnnualSavings / 12) * rampUp;
    });

    return {
      annualSavings: totalAnnualSavings,
      monthlyROI,
      monthlySavings,
      maxMonthlySaving: Math.max(...monthlySavings),
    };
  }, [hoursPerWeek, hourlyCost, toolSpend]);

  return (
    <div className="relative">
      {/* Gradient border wrapper */}
      <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[#00d4aa]/40 via-[#00b4d8]/20 to-[#7c3aed]/40">
        <div className="bg-[#111113] rounded-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #00d4aa, #00b4d8, #7c3aed)",
              }}
            >
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                AI Automation ROI Calculator
              </h3>
              <p className="text-sm text-[#a1a1aa]">
                Estimate your potential savings
              </p>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-6 mb-8">
            {/* Hours per week */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00d4aa]" />
                  Hours spent on manual tasks per week
                </label>
                <span className="text-sm font-mono text-[#00d4aa]">
                  {hoursPerWeek}h
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#0a0a0b] accent-[#00d4aa]"
                style={
                  {
                    "--range-progress": `${((hoursPerWeek - 5) / 95) * 100}%`,
                  } as React.CSSProperties
                }
              />
              <div className="flex justify-between text-xs text-[#a1a1aa] mt-1">
                <span>5h</span>
                <span>100h</span>
              </div>
            </div>

            {/* Hourly cost */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#00d4aa]" />
                  Average hourly cost ($)
                </label>
                <span className="text-sm font-mono text-[#00d4aa]">
                  ${hourlyCost}
                </span>
              </div>
              <input
                type="range"
                min={25}
                max={200}
                value={hourlyCost}
                onChange={(e) => setHourlyCost(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#0a0a0b] accent-[#00d4aa]"
              />
              <div className="flex justify-between text-xs text-[#a1a1aa] mt-1">
                <span>$25</span>
                <span>$200</span>
              </div>
            </div>

            {/* Tool spend */}
            <div>
              <label className="text-sm font-medium text-white flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#00d4aa]" />
                Current monthly tool spend ($)
              </label>
              <Input
                type="number"
                value={toolSpend}
                onChange={(e) => setToolSpend(e.target.value)}
                placeholder="500"
                className="font-mono"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4 mb-8">
            {/* Annual savings */}
            <div className="p-4 rounded-xl bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)]">
              <p className="text-sm text-[#a1a1aa] mb-1">
                Potential Annual Savings
              </p>
              <motion.p
                key={calculations.annualSavings}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #00d4aa, #00b4d8, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {formatCurrency(calculations.annualSavings)}
              </motion.p>
            </div>

            {/* Monthly ROI */}
            <div className="p-4 rounded-xl bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)]">
              <p className="text-sm text-[#a1a1aa] mb-1">Monthly ROI</p>
              <motion.p
                key={calculations.monthlyROI.toFixed(1)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-[#00d4aa]"
              >
                {calculations.monthlyROI.toFixed(1)}x
              </motion.p>
            </div>

            {/* Bar chart */}
            <div className="p-4 rounded-xl bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)]">
              <p className="text-sm text-[#a1a1aa] mb-4">
                Savings Growth (12 Months)
              </p>
              <div className="flex items-end gap-1 h-24">
                {calculations.monthlySavings.map((value, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t"
                    initial={{ height: 0 }}
                    animate={{
                      height:
                        calculations.maxMonthlySaving > 0
                          ? `${(value / calculations.maxMonthlySaving) * 100}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    style={{
                      background:
                        "linear-gradient(180deg, #00d4aa, #00b4d8)",
                      opacity: 0.6 + (i / 11) * 0.4,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#a1a1aa] mt-2">
                <span>Month 1</span>
                <span>Month 12</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <AnimatePresence mode="wait">
            {showEmailForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 rounded-xl bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-white">
                      Get your custom analysis
                    </p>
                    <button
                      onClick={() => setShowEmailForm(false)}
                      className="p-1 rounded text-[#a1a1aa] hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <EmailForm
                    variant="stacked"
                    buttonText="Send My Custom Report"
                    placeholder="you@company.com"
                    onSuccess={() => setShowEmailForm(false)}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full"
                  size="lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #00d4aa, #00b4d8, #7c3aed)",
                  }}
                >
                  Get Your Custom Analysis
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
