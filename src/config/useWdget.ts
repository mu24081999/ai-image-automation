import { useEffect, useState } from "react";

export function useWidgetConfig() {
  const [config, setConfig] = useState({
    brand: null as string | null,
    theme: "light" as "light" | "dark",
    logoUrl: null as string | null,
    primaryColor: "#2563eb", // default Tailwind blue
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setConfig({
      brand: params.get("brand"),
      theme: (params.get("theme") as "light" | "dark") || "light",
      logoUrl: params.get("logoUrl"),
      primaryColor: params.get("primaryColor") || "#2563eb",
    });
  }, []);

  return config;
}
