import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/resources';
import type { DashboardSummary } from '../types';

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-400 mt-1">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi
      .summary()
      .then((r) => setData(r.data.data))
      .catch(() => setError('Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading dashboard…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Products" value={String(data.totalProducts)} />
        <Stat label="Low stock" value={String(data.lowStockCount)} />
        <Stat label="Stock value" value={inr(data.stockValue)} />
        <Stat label="Sales revenue" value={inr(data.salesRevenue)} />
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="font-medium mb-3">Top products by units sold</h2>
        {data.topProducts.length === 0 ? (
          <p className="text-sm text-slate-400">No sales recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-1">Product</th>
                <th className="py-1 text-right">Units</th>
                <th className="py-1 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-1.5">{p.name}</td>
                  <td className="py-1.5 text-right">{p.unitsSold}</td>
                  <td className="py-1.5 text-right">{inr(Number(p.revenue))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
