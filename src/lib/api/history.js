// src/api/history.js
import { getAuthData } from "./utils";

export async function createHistoryBulk(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items must be a non-empty array");
  }

  const authData = getAuthData();

  if (!authData?.id) {
    throw new Error("Company ID not found");
  }

  // Inject company_id into each item
  const payload = {
    items: items.map((item) => ({
      ...item,
      company_id: authData.id,
    })),
  };

  const response = await fetch("/api/v1/history/bulk", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Bulk history creation failed (${response.status})`);
  }

  return await response.json();
}
