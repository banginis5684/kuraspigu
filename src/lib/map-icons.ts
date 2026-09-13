import L from "leaflet";
import { companySlug } from "./slug";

export function priceIcon(price: number, isCheapest: boolean, company?: string) {
  const bg = isCheapest ? "#f2b705" : "#111111";
  const color = isCheapest ? "#111111" : "#ffffff";
  const logo = company
    ? `<img src="/logos/${companySlug(company)}.png" alt="" onerror="this.remove()" style="width:26px;height:26px;border-radius:9999px;object-fit:contain;background:#ffffff;border:2px solid ${bg};box-shadow:0 1px 3px rgba(0,0,0,0.3);margin-bottom:2px;" />`
    : "";
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;">${logo}<div style="background:${bg};color:${color};border-radius:9999px;padding:3px 8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-family:inherit;">${price.toFixed(3)} €</div></div>`,
    iconSize: [60, company ? 50 : 22],
    iconAnchor: [30, company ? 56 : 28],
  });
}

export function clusterIcon(count: number) {
  const size = count < 10 ? 34 : count < 50 ? 42 : count < 150 ? 50 : 58;
  const fontSize = count < 100 ? 13 : 11;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;background:#111111;border:3px solid #f2b705;border-radius:9999px;display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:700;font-size:${fontSize}px;font-family:inherit;box-shadow:0 2px 6px rgba(0,0,0,0.35);">${count}</div>`,
    iconSize: [size, size],
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function popupHtml(params: {
  brand: string;
  city: string;
  address: string;
  isCheapest: boolean;
  fuelRows: { label: string; value: string; highlighted: boolean }[];
  company?: string;
}): string {
  const { brand, city, address, isCheapest, fuelRows, company } = params;
  const badge = isCheapest
    ? `<span style="margin-left:8px;border-radius:9999px;background:#f2b705;padding:2px 8px;font-size:10px;font-weight:700;text-transform:uppercase;color:#111111;">Pigiausia</span>`
    : "";
  const logo = company
    ? `<img src="/logos/${companySlug(company)}.png" alt="" onerror="this.remove()" style="width:32px;height:32px;border-radius:9999px;object-fit:contain;background:#ffffff;border:1px solid #e2e2e2;flex-shrink:0;" />`
    : "";
  const rows = fuelRows
    .map(
      (r) =>
        `<div style="display:flex;justify-content:space-between;gap:16px;"><span style="color:#6b6b6b;">${escapeHtml(r.label)}</span><span style="${r.highlighted ? "font-weight:600;color:#0a0a0a;" : "color:#0a0a0a;"}">${escapeHtml(r.value)}</span></div>`
    )
    .join("");
  return `<div style="min-width:160px;font-family:inherit;">
    <div style="display:flex;align-items:center;gap:8px;">
      ${logo}
      <div>
        <div style="font-weight:600;color:#0a0a0a;">${escapeHtml(brand)}${badge}</div>
        <div style="font-size:13px;color:#6b6b6b;">${escapeHtml(city)} · ${escapeHtml(address)}</div>
      </div>
    </div>
    <div style="margin-top:8px;display:flex;flex-direction:column;gap:2px;font-size:13px;">${rows}</div>
  </div>`;
}
