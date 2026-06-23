import React, { useEffect, useState } from "react";
import { EditPriceModal } from "./components/EditPriceModal.js";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard.js";

interface Resource {
  id: string;
  title: string;
  price: string;
  resourceType: string;
  publisherName: string;
}

const API_KEY = import.meta.env.VITE_API_KEY ?? "";
type Tab = "catalog" | "analytics";

export default function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [tab, setTab] = useState<Tab>("catalog");

  useEffect(() => {
    fetch("/resources")
      .then((r) => r.json())
      .then(setResources)
      .catch(console.error);
  }, []);

  function handleConfirmed(id: string, price: string) {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, price } : r))
    );
    setEditTarget(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">MindVault</h1>
        {API_KEY && (
          <div className="flex gap-2">
            <TabButton active={tab === "catalog"} onClick={() => setTab("catalog")}>Catalog</TabButton>
            <TabButton active={tab === "analytics"} onClick={() => setTab("analytics")}>My Analytics</TabButton>
          </div>
        )}
      </div>

      {tab === "analytics" && API_KEY ? (
        <AnalyticsDashboard apiKey={API_KEY} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="font-semibold text-gray-900">{r.title}</p>
              <p className="mt-1 text-sm text-gray-500">by {r.publisherName}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-600">
                  {r.price} USDC
                </span>
                {API_KEY && (
                  <button
                    onClick={() => setEditTarget(r)}
                    className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Edit price
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editTarget && (
        <EditPriceModal
          resourceId={editTarget.id}
          currentPrice={editTarget.price}
          apiKey={API_KEY}
          onClose={() => setEditTarget(null)}
          onConfirmed={(price) => handleConfirmed(editTarget.id, price)}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
