import { FormEvent, useEffect, useState } from 'react';
import { productsApi } from '../api/resources';
import { useAuth } from '../auth/AuthContext';
import type { Pagination, Product } from '../types';

export default function ProductsPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    productsApi
      .list({ search, page, limit: 10, sort: 'name', order: 'asc' })
      .then((r) => {
        setProducts(r.data.data);
        setPagination(r.data.pagination);
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };

  // Debounced reload on search/page change.
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Products</h1>
        {canManage && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md px-3 py-1.5"
          >
            {showForm ? 'Close' : '+ New product'}
          </button>
        )}
      </div>

      {showForm && canManage && <NewProductForm onCreated={() => { setShowForm(false); load(); }} />}

      <input
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        placeholder="Search by name or SKU…"
        className="w-full max-w-sm border rounded-md px-3 py-2 text-sm"
      />

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-slate-400 text-sm">No products found.</p>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2 text-right">Price</th>
                <th className="px-3 py-2 text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 text-slate-500">{p.category?.name ?? '—'}</td>
                  <td className="px-3 py-2 text-right">₹{Number(p.unitPrice).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 text-right">
                    <span className={p.quantityInStock <= p.reorderLevel ? 'text-red-600 font-medium' : ''}>
                      {p.quantityInStock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-2 py-1 border rounded disabled:opacity-40">
            Prev
          </button>
          <span className="text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function NewProductForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ sku: '', name: '', unitPrice: '', costPrice: '', quantityInStock: '' });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await productsApi.create({
        sku: form.sku,
        name: form.name,
        unitPrice: Number(form.unitPrice),
        costPrice: Number(form.costPrice),
        quantityInStock: Number(form.quantityInStock || 0),
      });
      onCreated();
    } catch {
      setError('Could not create product (SKU may already exist).');
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = 'text') => (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="mt-1 w-full border rounded-md px-2 py-1.5 text-sm"
        required={key !== 'quantityInStock'}
      />
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
      {field('sku', 'SKU')}
      {field('name', 'Name')}
      {field('unitPrice', 'Unit price', 'number')}
      {field('costPrice', 'Cost price', 'number')}
      {field('quantityInStock', 'Stock', 'number')}
      {error && <p className="col-span-full text-sm text-red-600">{error}</p>}
      <button disabled={saving} className="col-span-full md:col-span-1 bg-indigo-600 text-white text-sm rounded-md py-1.5">
        {saving ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
