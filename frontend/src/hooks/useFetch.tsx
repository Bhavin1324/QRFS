import { useState } from "react";
import { HttpMethods } from "../../types/Common";

export function useFetch<T>(url: string, method?: HttpMethods, payload?: T) {
  method = method || "GET";
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  async function MakeHttpRequest() {
    const response = await fetch(
      url,
      method !== "GET"
        ? {
            method: method,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          }
        : {}
    );
    const result = await response.json();
    setData(result);
    setIsLoading(false);
  }

  return { data, isLoading, MakeHttpRequest };
}
