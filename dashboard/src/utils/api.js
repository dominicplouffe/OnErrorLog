import { API_URL } from "./globals";
import { getToken, refreshToken } from "./auth";

const api = async (
  url,
  method = "GET",
  data = null,
  refresh = true,
  auth = true
) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (auth) {
    const token = getToken();
    if (!token) {
      return { unauthorized: true };
    }
    options.headers.Authorization = `Bearer ${token}`;
  }

  const fullUrl = new URL(url, API_URL);
  if (method === "GET" && data) {
    for (const key in data) {
      let vals = data[key];
      if (!Array.isArray(vals)) {
        vals = [vals];
      }
      for (const val of vals) {
        fullUrl.searchParams.append(key, val);
      }
    }
  } else if (data) {
    options.body = JSON.stringify(data);
  }

  const resp = await fetch(fullUrl.href, options);

  if (resp.ok) {
    if (resp.statusText === "No Content") {
      return {};
    }

    return { data: await resp.json() };
  } else if (auth && resp.status === 401) {
    if (auth && refresh) {
      const { refreshed = false } = await refreshToken();
      if (refreshed) {
        // Retry with new token
        return await api(url, method, data, false, auth);
      }
    }
    return { unauthorized: true };
  }
  const contentType = resp.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") >= 0) {
    const error = await resp.json();
    return { error: await error };
  }

  const statusText = resp.statusText;
  return { error: `Error: ${statusText}` };
};

export default api;
