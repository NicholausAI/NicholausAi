import {
  upsertSubscriber,
  getSubscriber,
  addSubscriberToGroup,
  removeSubscriberFromGroup,
  resolveGroupId,
  sendTransactionalEmail,
} from "./mailerlite";
import { getPurchaseReceiptHtml } from "./emails/purchase-receipt";
import { getSubscriptionConfirmationHtml } from "./emails/subscription-confirmation";
import { getRefundConfirmationHtml } from "./emails/refund-confirmation";

// ━━━ Event Types ━━━

export type EmailEvent =
  | {
      type: "subscriber.created";
      email: string;
      source?: string;
      utmSource?: string;
      utmCampaign?: string;
    }
  | {
      type: "contact.submitted";
      email: string;
      name: string;
      message: string;
    }
  | {
      type: "tripwire.offered";
      email: string;
      productSlug: string;
    }
  | {
      type: "tripwire.purchased";
      email: string;
      name: string;
      productSlug: string;
      productName: string;
      amount: number;
      currency: string;
      transactionId: string;
    }
  | {
      type: "product.purchased";
      email: string;
      name: string;
      productSlug: string;
      productName: string;
      productType: string;
      amount: number;
      currency: string;
      transactionId: string;
    }
  | {
      type: "subscription.created";
      email: string;
      name: string;
      productName: string;
      amount: number;
      currency: string;
      interval: "monthly" | "yearly";
    }
  | {
      type: "checkout.abandoned";
      email: string;
      name?: string;
      productSlug: string;
      productName: string;
    }
  | {
      type: "refund.processed";
      email: string;
      name: string;
      productName: string;
      refundAmount: number;
      currency: string;
      transactionId: string;
    };

// ━━━ Event Dispatcher ━━━

export async function handleEmailEvent(event: EmailEvent): Promise<void> {
  try {
    switch (event.type) {
      case "subscriber.created":
        return await handleSubscriberCreated(event);
      case "contact.submitted":
        return await handleContactSubmitted(event);
      case "tripwire.offered":
        return await handleTripwireOffered(event);
      case "tripwire.purchased":
        return await handleTripwirePurchased(event);
      case "product.purchased":
        return await handleProductPurchased(event);
      case "subscription.created":
        return await handleSubscriptionCreated(event);
      case "checkout.abandoned":
        return await handleCheckoutAbandoned(event);
      case "refund.processed":
        return await handleRefundProcessed(event);
    }
  } catch (err) {
    console.error(`[EmailEvents] Failed to handle ${event.type}:`, err);
  }
}

// ━━━ Handlers ━━━

async function handleSubscriberCreated(
  event: Extract<EmailEvent, { type: "subscriber.created" }>
) {
  const newsletterGroupId = await resolveGroupId("newsletter");

  const fields: Record<string, string | number> = {
    customer_type: "prospect",
    funnel_stage: "top",
  };
  if (event.utmSource) fields.utm_source = event.utmSource;
  if (event.utmCampaign) fields.utm_campaign = event.utmCampaign;

  await upsertSubscriber({
    email: event.email,
    fields,
    groups: [newsletterGroupId],
  });
}

async function handleContactSubmitted(
  event: Extract<EmailEvent, { type: "contact.submitted" }>
) {
  const leadContactGroupId = await resolveGroupId("lead_contact");

  // Add to MailerLite as a lead
  await upsertSubscriber({
    email: event.email,
    fields: {
      customer_type: "lead",
      funnel_stage: "middle",
    },
    groups: [leadContactGroupId],
  });

  // Send internal notification
  const contactEmail = process.env.CONTACT_EMAIL || process.env.FROM_EMAIL;
  if (contactEmail) {
    await sendTransactionalEmail({
      to: contactEmail,
      subject: `New contact from ${event.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${event.name}</p>
        <p><strong>Email:</strong> ${event.email}</p>
        <p><strong>Message:</strong></p>
        <p>${event.message.replace(/\n/g, "<br>")}</p>
      `,
    });
  }
}

async function handleTripwireOffered(
  event: Extract<EmailEvent, { type: "tripwire.offered" }>
) {
  const tripwireOfferedGroupId = await resolveGroupId("tripwire_offered");

  const subscriber = await getSubscriber(event.email);
  if (subscriber) {
    await addSubscriberToGroup(subscriber.id, tripwireOfferedGroupId);
  }
}

async function handleTripwirePurchased(
  event: Extract<EmailEvent, { type: "tripwire.purchased" }>
) {
  const [tripwireOfferedId, tripwireBoughtId, buyerAllId] = await Promise.all([
    resolveGroupId("tripwire_offered"),
    resolveGroupId("tripwire_bought"),
    resolveGroupId("buyer_all"),
  ]);

  const sub = await upsertSubscriber({
    email: event.email,
    fields: {
      customer_type: "buyer",
      funnel_stage: "bottom",
      last_product_purchased: event.productSlug,
      last_product_type: "course",
      total_spent: event.amount,
      purchase_count: 1,
      last_purchase_date: new Date().toISOString().split("T")[0],
    },
    groups: [tripwireBoughtId, buyerAllId],
  });

  // Remove from offered group (stop drip)
  if (sub.id) {
    await removeSubscriberFromGroup(sub.id, tripwireOfferedId);
  }

  // Send receipt
  const html = getPurchaseReceiptHtml({
    customerName: event.name,
    customerEmail: event.email,
    productName: event.productName,
    amount: event.amount,
    currency: event.currency,
    transactionId: event.transactionId,
  });

  await sendTransactionalEmail({
    to: event.email,
    subject: `Receipt for ${event.productName}`,
    html,
  });
}

async function handleProductPurchased(
  event: Extract<EmailEvent, { type: "product.purchased" }>
) {
  const [buyerAllId, productGroupId, checkoutAbandonedId] = await Promise.all([
    resolveGroupId("buyer_all"),
    resolveGroupId(`buyer_${event.productSlug}`),
    resolveGroupId("checkout_abandoned"),
  ]);

  // Get existing subscriber to check purchase count
  const existing = await getSubscriber(event.email);
  const currentCount = existing?.fields?.purchase_count;
  const newCount =
    (typeof currentCount === "number" ? currentCount : 0) + 1;
  const currentSpent = existing?.fields?.total_spent;
  const newSpent =
    (typeof currentSpent === "number" ? currentSpent : 0) + event.amount;

  const sub = await upsertSubscriber({
    email: event.email,
    fields: {
      customer_type: newCount > 1 ? "repeat_buyer" : "buyer",
      funnel_stage: "bottom",
      last_product_purchased: event.productSlug,
      last_product_type: event.productType,
      total_spent: newSpent,
      purchase_count: newCount,
      last_purchase_date: new Date().toISOString().split("T")[0],
    },
    groups: [buyerAllId, productGroupId],
  });

  // Remove from checkout abandoned if they were in it
  if (sub.id) {
    await removeSubscriberFromGroup(sub.id, checkoutAbandonedId);
  }

  // Send receipt
  const html = getPurchaseReceiptHtml({
    customerName: event.name,
    customerEmail: event.email,
    productName: event.productName,
    amount: event.amount,
    currency: event.currency,
    transactionId: event.transactionId,
  });

  await sendTransactionalEmail({
    to: event.email,
    subject: `Receipt for ${event.productName}`,
    html,
  });
}

async function handleSubscriptionCreated(
  event: Extract<EmailEvent, { type: "subscription.created" }>
) {
  const buyerAllId = await resolveGroupId("buyer_all");

  await upsertSubscriber({
    email: event.email,
    fields: {
      customer_type: "buyer",
      funnel_stage: "bottom",
    },
    groups: [buyerAllId],
  });

  const html = getSubscriptionConfirmationHtml({
    customerName: event.name,
    customerEmail: event.email,
    productName: event.productName,
    amount: event.amount,
    currency: event.currency,
    interval: event.interval,
  });

  await sendTransactionalEmail({
    to: event.email,
    subject: `Subscription Confirmed — ${event.productName}`,
    html,
  });
}

async function handleCheckoutAbandoned(
  event: Extract<EmailEvent, { type: "checkout.abandoned" }>
) {
  const checkoutAbandonedId = await resolveGroupId("checkout_abandoned");

  await upsertSubscriber({
    email: event.email,
    fields: {
      last_product_purchased: event.productSlug,
    },
    groups: [checkoutAbandonedId],
  });
}

async function handleRefundProcessed(
  event: Extract<EmailEvent, { type: "refund.processed" }>
) {
  const html = getRefundConfirmationHtml({
    customerName: event.name,
    customerEmail: event.email,
    productName: event.productName,
    refundAmount: event.refundAmount,
    currency: event.currency,
    transactionId: event.transactionId,
  });

  await sendTransactionalEmail({
    to: event.email,
    subject: `Refund Processed — ${event.productName}`,
    html,
  });
}
