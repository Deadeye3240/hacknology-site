import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Card } from "@/components/ui/Card";

interface FakeDatabaseChallengeProps {
  onSolve: () => void;
}

const PRODUCTS = [
  { id: 1, name: "USB Cable", price: 9.99 },
  { id: 2, name: "Keyboard", price: 49.99 },
  { id: 3, name: "Monitor", price: 299.99 },
];

const SECRET_ROW = {
  id: 0,
  name: "INTERNAL_FLAG",
  price: 0,
  flag: "FLAG{SQLI_DUMP}",
};

function searchProducts(term: string): typeof PRODUCTS | (typeof PRODUCTS[0] | typeof SECRET_ROW)[] {
  const injection =
    term.includes("'") &&
    (term.toLowerCase().includes("or 1=1") ||
      term.toLowerCase().includes("or '1'='1") ||
      term.includes("--"));

  if (injection) {
    return [...PRODUCTS, SECRET_ROW];
  }

  return PRODUCTS.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()));
}

export function FakeDatabaseChallenge({ onSolve }: FakeDatabaseChallengeProps) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchProducts>>([]);
  const [solved, setSolved] = useState(false);

  function runSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = `SELECT * FROM products WHERE name LIKE '%${search}%'`;
    setQuery(q);
    const rows = searchProducts(search);
    setResults(rows);
    if (rows.some((r) => "flag" in r && r.flag)) {
      setSolved(true);
      onSolve();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-white/10 bg-base-950/80">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Product search</p>
        <form onSubmit={runSearch} className="flex gap-2">
          <TextField
            label="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" size="sm" className="self-end">
            Search
          </Button>
        </form>
        {query && (
          <p className="mt-3 font-mono text-xs text-amber-200/80">
            Query: <code className="break-all">{query}</code>
          </p>
        )}
        {results.length > 0 && (
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-500">
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="py-2 text-slate-300">{row.id}</td>
                  <td className="py-2 text-white">
                    {row.name}
                    {"flag" in row && row.flag && (
                      <span className="ml-2 text-emerald-300">({row.flag})</span>
                    )}
                  </td>
                  <td className="py-2 text-slate-300">${row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {solved && (
          <p className="mt-3 text-xs text-emerald-300">Secret row leaked via injection!</p>
        )}
      </Card>
    </div>
  );
}
