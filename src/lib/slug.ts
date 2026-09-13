/** Strips common Lithuanian legal-entity prefixes from a company name. */
export function normalizeCompanyName(raw: string): string {
  return raw
    .replace(/^(UAB|AB|VĮ|I\.?Į\.?|IĮ)\s+/i, "")
    .trim();
}

/** Turns a company name into a filesystem/URL-safe slug for logo lookup. */
export function companySlug(company: string): string {
  return normalizeCompanyName(company)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
