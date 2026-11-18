async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

const post = (url, body) =>
  request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const api = {
  states: () => request("/api/states"),
  districts: (state) => request(`/api/districts?state=${encodeURIComponent(state)}`),
  crops: () => request("/api/crops"),
  irrigation: (payload) => post("/api/irrigation", payload),
  contact: (payload) => post("/api/contact", payload),
};
