import { HttpMethods } from "../types/Common";

export function useFetch<T>(
  url: string,
  method?: HttpMethods,
  payload?: T,
  token?: string
) {
  method = method || "GET";
  async function MakeHttpRequest() {
    const response = await fetch(
      url,
      method !== "GET"
        ? {
            method: method,
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                  "content-type": "application/json",
                }
              : { "content-type": "application/json" },
            body: JSON.stringify(payload),
          }
        : token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}
    );
    const result = await response.json();
    return result;
  }

  return MakeHttpRequest;
}
