import { getAuthData } from "./utils";

export async function getLedgers() {

  const authData = await getAuthData();
  
  const payload = {
    client_id: authData.id,
    method: "POST",
    endpoint: "/api/ledger/get-ledgers",
    body: {
      tally_url: "http://localhost:9000/",
      company_name: authData.company_name,
    },
  };

  try {
    const response = await fetch("/api/v1/forward", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get ledgers API error:", error);
    throw error;
  }
}

export async function createLedger(ledgerName, parentGroup) {

  const authData = await getAuthData();
  
  const payload = {
    client_id: authData.id,
    method: "POST",
    endpoint: "/api/ledger/create",
    body: {
      tally_url: "http://localhost:9000/",
      company_name: authData.company_name,
      ledger_name: ledgerName,
      group_name: parentGroup,
      tax_applicable:"no",
      tds_applicable:"no",
      date:"20250401"
    },
  };

  try {
    const response = await fetch("/api/v1/forward", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get ledgers API error:", error);
    throw error;
  }
}