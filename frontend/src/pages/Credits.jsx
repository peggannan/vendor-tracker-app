// src/pages/Credits.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCredits } from "../api/api";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import Navbar from "../components/Navbar";
import { ListSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendar,
  faCircleCheck,
  faCreditCard,
  faReceipt,
  faTriangleExclamation,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function formatMoney(value) {
  const amount = Number.parseFloat(value ?? 0);
  return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
}

function formatDate(value) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Credits() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCredits()
      .then(({ data }) => setCredits(data.credits ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const outstanding = credits.filter((credit) => !credit.paid);
    const overdue = outstanding.filter((credit) => credit.due_date && new Date(credit.due_date) < new Date());
    const paid = credits.filter((credit) => credit.paid);
    const totalOutstanding = outstanding.reduce((sum, credit) => sum + Number.parseFloat(credit.amount_remaining ?? credit.amount_owed ?? 0), 0);
    return {
      totalOutstanding,
      outstandingCount: outstanding.length,
      overdueCount: overdue.length,
      paidCount: paid.length,
    };
  }, [credits]);

  const visibleCredits = credits;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 max-w-lg mx-auto lg:max-w-full">
      <Header />
      <PageHeader title="Credits" />

      <div className="px-4 pt-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Credit Ledger</h1>
            <p className="text-xs text-gray-400 mt-0.5">Track who owes, what is due, and where each balance came from.</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
            <FontAwesomeIcon icon={faCreditCard} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Outstanding</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">₵{formatMoney(summary.totalOutstanding)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{summary.outstandingCount} customers</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Overdue</p>
            <p className="text-xl font-bold text-red-500">{summary.overdueCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Past due date</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {[
            { label: "All", value: visibleCredits.length },
            { label: "Outstanding", value: summary.outstandingCount },
            { label: "Paid", value: summary.paidCount },
          ].map((pill) => (
            <div key={pill.label} className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{pill.label}</p>
              <p className="text-base font-bold text-gray-800 dark:text-gray-100">{pill.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <ListSkeleton count={4} type="card" />
        ) : visibleCredits.length === 0 ? (
          <EmptyState
            type="transactions"
            message="No credits are tracked yet. When a sale is recorded on credit, it will appear here automatically."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {visibleCredits.map((credit) => {
              const overdue = !credit.paid && credit.due_date && new Date(credit.due_date) < new Date();
              return (
                <div
                  key={credit.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border ${credit.paid ? "border-green-200 dark:border-green-900/50" : overdue ? "border-red-200 dark:border-red-900/50" : "border-gray-100 dark:border-gray-700"}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/customers/${credit.customer_id}`)}
                      className="flex items-center gap-3 text-left min-w-0 flex-1"
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${credit.paid ? "bg-green-50 text-green-600" : overdue ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-600"}`}>
                        <FontAwesomeIcon icon={credit.paid ? faCircleCheck : overdue ? faTriangleExclamation : faUser} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{credit.customer_name}</p>
                        <p className="text-xs text-gray-400 truncate">Customer ID: {credit.customer_id}</p>
                      </div>
                    </button>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-gray-900 dark:text-white text-lg">₵{formatMoney(credit.amount_remaining ?? credit.amount_owed)}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Remaining</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <button
                      type="button"
                      onClick={() => navigate(`/transactions/${credit.sale_id}`)}
                      className="rounded-xl bg-gray-50 dark:bg-gray-700/60 px-3 py-2 text-left border border-gray-100 dark:border-gray-700"
                    >
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Transaction</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">TX-{credit.sale_id ?? "—"}</p>
                    </button>
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-700/60 px-3 py-2 border border-gray-100 dark:border-gray-700">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Due Date</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{formatDate(credit.due_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>Created {formatDate(credit.created_at)}</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${credit.paid ? "bg-green-50 text-green-600" : overdue ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-600"}`}>
                      {credit.paid ? "Paid" : overdue ? "Overdue" : "Owing"}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/transactions/${credit.sale_id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 text-white text-xs font-semibold py-2.5"
                    >
                      View Transaction
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/customers/${credit.customer_id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold py-2.5"
                    >
                      View Customer
                      <FontAwesomeIcon icon={faUser} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}
