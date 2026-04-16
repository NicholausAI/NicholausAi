interface ReceiptParams {
  customerEmail: string;
  customerName: string;
  productName: string;
  amount: number;
  currency: string;
  transactionId: string;
}

export function getPurchaseReceiptHtml(params: ReceiptParams): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: params.currency.toUpperCase(),
  }).format(params.amount);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Receipt</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #fafafa;">
  <div style="background: #ffffff; border-radius: 8px; padding: 40px; border: 1px solid #e5e5e5;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 24px; margin: 0 0 8px;">Payment Confirmed</h1>
      <p style="color: #666; margin: 0; font-size: 14px;">Thank you for your purchase, ${params.customerName}.</p>
    </div>

    <div style="background: #f9f9f9; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Product</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${params.productName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Amount</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formattedAmount}</td>
        </tr>
        <tr style="border-top: 1px solid #e5e5e5;">
          <td style="padding: 12px 0 0; color: #666; font-size: 14px;">Transaction ID</td>
          <td style="padding: 12px 0 0; text-align: right; font-family: monospace; font-size: 13px;">${params.transactionId}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 14px; color: #666; margin-bottom: 24px;">
      If you have any questions about your purchase, reply to this email.
    </p>

    <div style="text-align: center; padding: 16px; background: #f9f9f9; border-radius: 6px;">
      <p style="margin: 0; font-size: 13px; color: #666;">
        All sales are final. See our refund policy at nicholaus.ai/refund
      </p>
    </div>
  </div>

  <p style="font-size: 12px; color: #999; text-align: center; margin-top: 24px;">
    Nicholaus, LLC &middot; This receipt was sent to ${params.customerEmail}
  </p>
</body>
</html>`;
}
