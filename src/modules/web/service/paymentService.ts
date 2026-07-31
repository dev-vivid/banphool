import prisma from "../../../config/prisma";
import razorpay from "../../../config/razorpay";

import { sendPaymentSuccessEmails } from "../../../services/paymentEmailService";

import crypto from "crypto";

interface PaymentFindAllOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  skip: number;
  limit: number;
}

export const findAll = async ({
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  skip,
  limit,
}: PaymentFindAllOptions) => {
  const where = search
    ? {
        OR: [
          {
            transactionNo: {
              contains: search,
            },
          },
          {
            donorName: {
              contains: search,
            },
          },
          {
            donorEmail: {
              contains: search,
            },
          },
          {
            donorPhone: {
              contains: search,
            },
          },
        ],
      }
    : {};

  const orderBy = {
    [sortBy]: sortOrder,
  };

  const [total, rows] = await prisma.$transaction([
    prisma.payment.count({
      where,
    }),
    prisma.payment.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
  ]);

  return {
    rows,
    total,
  };
};

export const findById = async (id: string) => {
  return prisma.payment.findUnique({
    where: {
      id,
    },
  });
};

export const findByTransactionNo = async (transactionNo: string) => {
  return prisma.payment.findUnique({
    where: {
      transactionNo,
    },
  });
};

export const generateTransactionNo = async () => {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const prefix = `BP${year}${month}${day}`;

  const latest = await prisma.payment.findFirst({
    where: {
      transactionNo: {
        startsWith: prefix,
      },
    },
    orderBy: {
      transactionNo: "desc",
    },
  });

  let runningNo = 1;

  if (latest?.transactionNo) {
    runningNo = parseInt(latest.transactionNo.slice(-4), 10) + 1;
  }

  return `${prefix}${String(runningNo).padStart(4, "0")}`;
};

export const create = async (data: any) => {
  const transactionNo = await generateTransactionNo();

  const razorpayOrder = await razorpay.orders.create({
    amount: Number(data.amount) * 100, // Amount in paise
    currency: "INR",
    receipt: transactionNo,
    notes: {
      donorName: data.donorName,
      donorEmail: data.donorEmail || "",
      donorPhone: data.donorPhone || "",
    },
  });

  const payment = await prisma.payment.create({
    data: {
      transactionNo,

      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,

      amount: data.amount,

      paymentMethod: data.paymentMethod,

      paymentStatus: "PENDING",

      gateway: "RAZORPAY",
      gatewayOrderId: razorpayOrder.id,

      remarks: data.remarks,

      gatewayResponse: razorpayOrder as any,
    },
  });

  return {
    ...payment,
    razorpayOrderId: razorpayOrder.id,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  };
};

export const updateStatus = async (
  transactionNo: string,
  paymentStatus: string,
  gatewayPaymentId?: string,
  gatewayResponse?: any
) => {
  return prisma.payment.update({
    where: {
      transactionNo,
    },
    data: {
      paymentStatus,
      gatewayPaymentId,
      gatewayResponse,
    },
  });
};


export const verifyPayment = async (data: any) => {
  const {
    transactionNo,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = data;

  const payment = await findByTransactionNo(transactionNo);

  if (!payment) {
    throw {
      statusCode: 404,
      message: "Payment not found",
    };
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    await updateStatus(
      transactionNo,
      "FAILED",
      razorpay_payment_id,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }
    );

    throw {
      statusCode: 400,
      message: "Invalid payment signature",
    };
  }

  const paymentDetails = await razorpay.payments.fetch(
    razorpay_payment_id
  );

  const updatedPayment = await prisma.payment.update({
    where: {
      transactionNo,
    },
    data: {
      paymentStatus: "SUCCESS",
      gatewayPaymentId: razorpay_payment_id,
      gatewayResponse: paymentDetails as any,
    },
  });

  return updatedPayment;
};

export const handleWebhook = async (
  payload: any,
  headers: any
) => {
  try {
    // Verify Razorpay Webhook Signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    const receivedSignature = headers["x-razorpay-signature"] as string;

    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (generatedSignature !== receivedSignature) {
      throw new Error("Invalid Razorpay Webhook Signature");
    }

    const event = payload.event;

    // Process only successful payments
    if (event !== "payment.captured") {
      console.log(`Webhook ignored: ${event}`);
      return true;
    }

    const paymentEntity = payload.payload.payment.entity;

    const gatewayOrderId = paymentEntity.order_id;

    const paymentRecord = await prisma.payment.findFirst({
      where: {
        gatewayOrderId,
      },
    });

    // Payment not found
    if (!paymentRecord) {
      console.log("Webhook: Payment record not found");
      return true;
    }

    // Already updated
    if (paymentRecord.paymentStatus === "SUCCESS") {
      console.log("Webhook: Payment already updated");
      return true;
    }

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: {
        id: paymentRecord.id,
      },
      data: {
        paymentStatus: "SUCCESS",
        gatewayPaymentId: paymentEntity.id,
        gatewayResponse: paymentEntity,
      },
    });

    console.log(
      `Webhook: Payment ${updatedPayment.transactionNo} updated successfully`
    );

    // Send emails
    try {
      await sendPaymentSuccessEmails(updatedPayment);
      console.log("Payment success emails sent successfully.");
    } catch (emailError: any) {
      console.error("Email Error:", emailError.message);
    }

    return true;
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    throw error;
  }
};

export default {
  findAll,
  findById,
 findByTransactionNo,
 generateTransactionNo,
 create,
 updateStatus,
 verifyPayment,
 handleWebhook,
};