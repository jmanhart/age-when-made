import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import * as Sentry from "@sentry/react";
import { logApiCall, logApiSuccess, logApiError } from "../utils/sentry";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = performance.now();
      setLoading(true);
      setError(null);

      try {
        logApiCall(url, "GET", { hook: "useFetch" });

        const response: AxiosResponse<T> = await axios.get(url);
        const responseTime = performance.now() - startTime;

        logApiSuccess(url, responseTime, {
          hook: "useFetch",
          hasData: !!response.data,
        });

        setData(response.data);
      } catch (err) {
        const responseTime = performance.now() - startTime;
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch data";

        logApiError(url, err as Error, {
          hook: "useFetch",
          responseTime,
        });

        // Capture the error in Sentry
        Sentry.captureException(err);

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
