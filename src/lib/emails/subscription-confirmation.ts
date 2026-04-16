interface SubscriptionParams {
  customerEmail: string;
  customerName: string;
  productName: string;
  amount: number;
  currency: string;
  interval: "monthly" | "yearly";
}

export function getSubscriptionConfirmationHtml(params: SubscriptionParams): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: params.currency.toUpperCase(),
  }).format(params.amount);

  const intervalLabel = params.interval === "monthly" ? "month" : "year";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #fafafa;">
  <div style="background: #ffffff; border-radius: 8px; padding: 40px; border: 1px solid #e5e5e5;">
    <h1 style="font-size: 24px; margin: 0 0 16px; text-align: center;">Subscription Active</h1>
    <p style="color: #666; text-align: center; margin-bottom: 24px;">
      Hi ${params.customerName}, your subscription is now active.
    </p>

    <div style="background: #f9f9f9; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Product</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${params.productName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Billing</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formattedAmount}/${intervalLabel}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 14px; color: #666;">
      You'll be billed ${formattedAmount} every ${intervalLabel}. If you have questions, reply to this email.
    </p>
  </div>

  <p style="font-size: 12px; color: #999; text-align: center; margin-top: 24px;">
    Nicholaus, LLC &middot; All sales are final.
  </p>
</body>
</html>`;
}
