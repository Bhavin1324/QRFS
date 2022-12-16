import { HttpMethods } from "../types/Common";

export function useFetch<T>(
  url: string,
  method?: HttpMethods,
  payload?: T,
  token?: string
) {
  method = method || "GET";
  async function MakeHttpRequest(id?: string) {
    const response = await fetch(
      id ? url + id : url,
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
    if (method === "PATCH" || method === "PUT") {
      return;
    }
    const result = await response.json();
    return result;
  }

  return MakeHttpRequest;
}
