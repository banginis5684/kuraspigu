import type { MetadataRoute } from "next";

const BASE_URL = "https://kuraspigu.lt";
const ROUTES = [
  "",
  "/kainos",
  "/apie-mus",
  "/kontaktai",
  "/privatumo-politika",
  "/naudojimosi-taisykles",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
