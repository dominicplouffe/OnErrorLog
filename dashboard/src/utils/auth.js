import { API_URL, ACCESS, REFRESH } from "./globals";

const login = async (data) => {
  const resp = await fetch(`${API_URL}api-token-auth/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (resp.ok) {
    const { access, refresh } = await resp.json();
    localStorage.setItem(ACCESS, access);
    localStorage.setItem(REFRESH, refresh);
    return { isAuthenticated: true };
  } else {
    return await resp.json();
  }
};

const logout = () => {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
};

const refreshToken = async () => {
  const data = { refresh: localStorage.getItem(REFRESH) };
  const resp = await fetch(`${API_URL}token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (resp.ok) {
    const { access } = await resp.json();
    localStorage.setItem(ACCESS, access);
    return { refreshed: true };
  } else {
    logout();
    return { error: await resp.json() };
  }
};

const getToken = () => localStorage.getItem(ACCESS);

export { login, logout, refreshToken, getToken };
