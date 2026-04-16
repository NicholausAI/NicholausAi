import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { convex } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { addToVault, deleteFromVault, isApproved } from "@/lib/nmi";
import { checkRateLimit } from "@/lib/rate-limit";

const addVaultSchema = z.object({
  paymentToken: z.string().min(1),
  customerEmail: z.string().email(),
  customerName: z.string().min(1).max(100),
  billingAddress: z
    .object({
      address1: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

const deleteVaultSchema = z.object({
  nmiCustomerVaultId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = checkRateLimit(`vault:${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = addVaultSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { paymentToken, customerEmail, customerName, billingAddress } =
      parsed.data;

    const nmiResponse = await addToVault({
      paymentToken,
      customerEmail,
      customerName,
      billingAddress,
    });

    if (isApproved(nmiResponse) && nmiResponse.customer_vault_id) {
      // Store vault record in Convex
      const vaultId = await convex.mutation(api.customerVault.create, {
        customerEmail,
        customerName,
        nmiCustomerVaultId: nmiResponse.customer_vault_id,
        isDefault: true,
      });

      return NextResponse.json({
        success: true,
        vaultId,
        nmiCustomerVaultId: nmiResponse.customer_vault_id,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: nmiResponse.responsetext || "Failed to store payment method",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Vault add error:", error);
    return NextResponse.json(
      { error: "Failed to store payment method" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = deleteVaultSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { nmiCustomerVaultId } = parsed.data;

    // Delete from NMI
    await deleteFromVault(nmiCustomerVaultId);

    // Delete from Convex
    const vaultRecord = await convex.query(api.customerVault.getByNmiVaultId, {
      nmiCustomerVaultId,
    });
    if (vaultRecord) {
      await convex.mutation(api.customerVault.remove, { id: vaultRecord._id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vault delete error:", error);
    return NextResponse.json(
      { error: "Failed to remove payment method" },
      { status: 500 }
    );
  }
}
