export function getAuthData() {
  const raw = localStorage.getItem("auth_data");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Invalid auth_data in localStorage");
    return null;
  }
}