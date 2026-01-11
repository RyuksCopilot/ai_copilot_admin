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

  const response = await fetch("https://ai-copilot-api-call-server.onrender.com/api/v1/history/bulk", {
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


export async function getHistoryByCompanyId() {
  const authData = getAuthData();

  if (!authData?.id) {
    throw new Error("Company ID not found");
  }

  const response = await fetch(
    `https://ai-copilot-api-call-server.onrender.com/api/v1/history/${authData.id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch history (${response.status})`);
  }

  // Read body ONCE
  const data = await response.json();

  // Log parsed data, not response.json()
  console.log("Response received from history API", data);

  return data;
}