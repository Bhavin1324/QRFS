import Swal from "sweetalert2";
import { HttpMethods } from "../types/Common";

export function useFetch<T>(
  url: string,
  method?: HttpMethods,
  payload?: T,
  token?: string
) {
  method = method || "GET";
  async function MakeHttpRequest(id?: string, query?: string) {
    try {
      const response = await fetch(
        id && query
          ? url + id + query
          : id
          ? url + id
          : query
          ? url + query
          : url,
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
    } catch (ex) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! unable to perform an opertaion",
      });
    }
  }

  return MakeHttpRequest;
}
