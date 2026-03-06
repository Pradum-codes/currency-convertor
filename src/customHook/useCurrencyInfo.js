import { useEffect, useState } from "react";

function useCurrencyInfo(currency) {
  const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currency) return undefined;
    const controller = new AbortController();
    let isActive = true;

    const fetchRates = async () => {
      setIsLoading(true);
      setError("");

      try {
        const url = apiKey
          ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`
          : `https://open.er-api.com/v6/latest/${currency}`;

        const response = await fetch(url, { signal: controller.signal });
        const result = await response.json();

        if (!response.ok || result?.result === "error") {
          const message = result?.["error-type"] || "Failed to fetch rates";
          throw new Error(message);
        }

        const conversionRates = result?.conversion_rates ?? result?.rates;

        if (!conversionRates) {
          throw new Error("Rates data missing in API response");
        }

        if (isActive) {
          setData({ ...result, conversion_rates: conversionRates });
        }
      } catch (fetchError) {
        if (fetchError.name !== "AbortError" && isActive) {
          setError(fetchError.message || "Failed to fetch rates");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchRates();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [currency, apiKey]);

  return { data, isLoading, error };
}

export default useCurrencyInfo;
