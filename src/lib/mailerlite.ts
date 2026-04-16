const API_BASE = "https://connect.mailerlite.com/api";
const API_KEY = process.env.MAILERLITE_API_KEY || "";

// ━━━ Types ━━━

interface MLSubscriber {
  id: string;
  email: string;
  fields: Record<string, string | number | null>;
  groups: { id: string; name: string }[];
  status: string;
}

interface MLGroup {
  id: string;
  name: string;
  active_count: number;
}

interface MLField {
  id: string;
  key: string;
  name: string;
  type: string;
}

// ━━━ HTTP Helper ━━━

async function mlFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_KEY) {
    console.log(`[MailerLite] DEV MODE — ${options.method || "GET"} ${path}`);
    return {} as T;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[MailerLite] ${res.status} ${path}:`, body);
    throw new Error(`MailerLite API error: ${res.status}`);
  }

  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text);
}

// ━━━ Group Cache ━━━

const groupCache = new Map<string, string>();

export async function resolveGroupId(name: string): Promise<string> {
  if (groupCache.has(name)) return groupCache.get(name)!;
  const group = await getOrCreateGroup(name);
  groupCache.set(name, group.id);
  return group.id;
}

// ━━━ Subscriber Management ━━━

export async function upsertSubscriber(params: {
  email: string;
  fields?: Record<string, string | number>;
  groups?: string[]; // group IDs
  status?: "active" | "unsubscribed" | "unconfirmed";
}): Promise<{ id: string; email: string }> {
  const body: Record<string, unknown> = {
    email: params.email,
  };
  if (params.fields) body.fields = params.fields;
  if (params.groups) body.groups = params.groups;
  if (params.status) body.status = params.status;

  const res = await mlFetch<{ data: MLSubscriber }>("/subscribers", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return { id: res.data?.id || "", email: params.email };
}

export async function getSubscriber(
  email: string
): Promise<MLSubscriber | null> {
  try {
    const res = await mlFetch<{ data: MLSubscriber }>(
      `/subscribers/${encodeURIComponent(email)}`
    );
    return res.data || null;
  } catch {
    return null;
  }
}

export async function addSubscriberToGroup(
  subscriberId: string,
  groupId: string
): Promise<void> {
  await mlFetch(`/subscribers/${subscriberId}/groups/${groupId}`, {
    method: "POST",
  });
}

export async function removeSubscriberFromGroup(
  subscriberId: string,
  groupId: string
): Promise<void> {
  try {
    await mlFetch(`/subscribers/${subscriberId}/groups/${groupId}`, {
      method: "DELETE",
    });
  } catch {
    // Ignore — subscriber may not be in group
  }
}

// ━━━ Group Management ━━━

export async function listGroups(): Promise<MLGroup[]> {
  const all: MLGroup[] = [];
  let cursor: string | null = "/groups?limit=50";

  while (cursor) {
    const res = await mlFetch<{
      data: MLGroup[];
      links: { next: string | null };
    }>(cursor);
    all.push(...(res.data || []));
    cursor = res.links?.next
      ? res.links.next.replace(API_BASE, "")
      : null;
  }

  return all;
}

export async function getOrCreateGroup(name: string): Promise<MLGroup> {
  // Check cache first
  if (groupCache.has(name)) {
    return { id: groupCache.get(name)!, name, active_count: 0 };
  }

  // Search existing
  const res = await mlFetch<{ data: MLGroup[] }>(
    `/groups?filter[name]=${encodeURIComponent(name)}`
  );

  const existing = res.data?.find(
    (g) => g.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) {
    groupCache.set(name, existing.id);
    return existing;
  }

  // Create new
  const created = await mlFetch<{ data: MLGroup }>("/groups", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  groupCache.set(name, created.data.id);
  return created.data;
}

// ━━━ Custom Fields ━━━

export async function ensureCustomFields(
  fields: { key: string; type: "text" | "number" | "date" }[]
): Promise<void> {
  const existing = await mlFetch<{ data: MLField[] }>("/fields?limit=100");
  const existingKeys = new Set(
    (existing.data || []).map((f) => f.key.toLowerCase())
  );

  for (const field of fields) {
    if (!existingKeys.has(field.key.toLowerCase())) {
      try {
        await mlFetch("/fields", {
          method: "POST",
          body: JSON.stringify({ name: field.key, type: field.type }),
        });
        console.log(`[MailerLite] Created field: ${field.key}`);
      } catch (err) {
        console.error(`[MailerLite] Failed to create field ${field.key}:`, err);
      }
    }
  }
}

// ━━━ Transactional Email ━━━

export async function sendTransactionalEmail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<void> {
  const fromEmail = params.from || process.env.FROM_EMAIL || "onboarding@resend.dev";

  // MailerLite doesn't have a dedicated transactional endpoint on free plan.
  // Use a single-recipient campaign approach or fall back to a simple send.
  // For now, we create a one-off campaign to the subscriber.
  try {
    // First ensure subscriber exists
    await upsertSubscriber({ email: params.to });

    // Use the automation/transactional workaround:
    // Send via fetch to their email endpoint
    await mlFetch("/campaigns", {
      method: "POST",
      body: JSON.stringify({
        name: `Transactional: ${params.subject} - ${Date.now()}`,
        type: "regular",
        emails: [
          {
            subject: params.subject,
            from: fromEmail,
            from_name: "Nicholaus",
            content: params.html,
          },
        ],
        // We'll use a filter to target just this one subscriber
        filter: {
          email: params.to,
        },
      }),
    });
  } catch (err) {
    // Fallback: log the error but don't block the calling function
    console.error("[MailerLite] Transactional email failed:", err);
    console.log(`[MailerLite] Would have sent "${params.subject}" to ${params.to}`);
  }
}

// ━━━ Campaign (Newsletter) ━━━

export async function sendCampaign(params: {
  subject: string;
  html: string;
  groupId: string;
  name?: string;
}): Promise<{ id: string }> {
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

  // Create campaign
  const campaign = await mlFetch<{ data: { id: string } }>("/campaigns", {
    method: "POST",
    body: JSON.stringify({
      name: params.name || `Campaign: ${params.subject}`,
      type: "regular",
      emails: [
        {
          subject: params.subject,
          from: fromEmail,
          from_name: "Nicholaus",
          content: params.html,
        },
      ],
      groups: [params.groupId],
    }),
  });

  const campaignId = campaign.data.id;

  // Send it
  await mlFetch(`/campaigns/${campaignId}/schedule`, {
    method: "POST",
    body: JSON.stringify({ delivery: "instant" }),
  });

  return { id: campaignId };
}
