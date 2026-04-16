/**
 * One-time setup script for MailerLite groups and custom fields.
 * Run via: npx tsx src/lib/mailerlite-setup.ts
 */

const API_BASE = "https://connect.mailerlite.com/api";
const API_KEY = process.env.MAILERLITE_API_KEY || "";

async function mlFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// ━━━ Groups to create ━━━
const GROUPS = [
  "newsletter",
  "buyer_all",
  "tripwire_offered",
  "tripwire_bought",
  "checkout_abandoned",
  "lead_contact",
  "lead_magnet",
];

// ━━━ Custom fields to create ━━━
const FIELDS = [
  { name: "source", type: "text" },
  { name: "customer_type", type: "text" },
  { name: "funnel_stage", type: "text" },
  { name: "last_product_purchased", type: "text" },
  { name: "last_product_type", type: "text" },
  { name: "total_spent", type: "number" },
  { name: "purchase_count", type: "number" },
  { name: "last_purchase_date", type: "text" },
  { name: "utm_source", type: "text" },
  { name: "utm_campaign", type: "text" },
];

async function setup() {
  console.log("🔧 MailerLite Setup\n");

  if (!API_KEY) {
    console.error("❌ MAILERLITE_API_KEY not set");
    process.exit(1);
  }

  // Verify API key
  try {
    await mlFetch("/groups?limit=1");
    console.log("✅ API key verified\n");
  } catch (err) {
    console.error("❌ API key invalid:", err);
    process.exit(1);
  }

  // Create groups
  console.log("── Groups ──");
  const existingGroups = await mlFetch<{ data: { id: string; name: string }[] }>(
    "/groups?limit=50"
  );
  const existingNames = new Set(
    (existingGroups.data || []).map((g) => g.name.toLowerCase())
  );

  for (const name of GROUPS) {
    if (existingNames.has(name.toLowerCase())) {
      const group = existingGroups.data.find(
        (g) => g.name.toLowerCase() === name.toLowerCase()
      );
      console.log(`  ✓ ${name} (exists: ${group?.id})`);
    } else {
      const res = await mlFetch<{ data: { id: string } }>("/groups", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      console.log(`  + ${name} (created: ${res.data.id})`);
    }
  }

  // Create custom fields
  console.log("\n── Custom Fields ──");
  const existingFields = await mlFetch<{
    data: { key: string; name: string }[];
  }>("/fields?limit=100");
  const existingKeys = new Set(
    (existingFields.data || []).map((f) => f.key.toLowerCase())
  );

  for (const field of FIELDS) {
    if (existingKeys.has(field.name.toLowerCase())) {
      console.log(`  ✓ ${field.name} (exists)`);
    } else {
      try {
        await mlFetch("/fields", {
          method: "POST",
          body: JSON.stringify({ name: field.name, type: field.type }),
        });
        console.log(`  + ${field.name} (created)`);
      } catch (err) {
        console.log(`  ⚠ ${field.name} (failed: ${err})`);
      }
    }
  }

  console.log("\n✅ Setup complete!");
}

setup();
