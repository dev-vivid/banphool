import paymentService from "../service/paymentService";
import { writeAudit } from "../../../services/auditService";
import {
  parsePagination,
  buildPaginationMeta,
} from "../../../shared/helpers/pagination";
import {
  AUDIT_ACTIONS,
  PAYMENT_SORT_FIELDS,
  PAYMENT_STATUS,
} from "../../../constants";

export const getAll = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const sortBy = PAYMENT_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { rows, total } = await paymentService.findAll({
    search: query.search || undefined,
    sortBy,
    sortOrder,
    skip,
    limit,
  });

  return {
    data: rows,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getById = async (id: string) => {
  const payment = await paymentService.findById(id);

  if (!payment) {
    throw {
      statusCode: 404,
      message: "Payment not found",
    };
  }

  return payment;
};

export const create = async (body: any, req: any) => {
  const payment = await paymentService.create(body);

  await writeAudit({
    action: AUDIT_ACTIONS.CREATE,
    resource: "payments",
    resourceId: payment.id,
    req,
    newValues: payment,
  });

  return payment;
};

export const getStatus = async (transactionNo: string) => {
  const payment = await paymentService.findByTransactionNo(transactionNo);

  if (!payment) {
    throw {
      statusCode: 404,
      message: "Payment not found",
    };
  }

  return payment;
};

export const verify = async (body: any, req: any) => {
  const payment = await paymentService.verifyPayment(body);

  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    resource: "payments",
    resourceId: payment.id,
    req,
    newValues: payment,
  });

  return payment;
};

export const webhook = async (
  payload: any,
  headers: any
) => {
  return paymentService.handleWebhook(payload, headers);
};



export const updateStatus = async (
  id: string,
  isActive: boolean,
  req: any
) => {
  const existing = await paymentService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Volunteer not found",
    };
  }

  const updated = await paymentService.updateAccountStatus(id, isActive);

  await writeAudit({
    action: isActive
      ? AUDIT_ACTIONS.UPDATE
      : AUDIT_ACTIONS.UPDATE,
    resource: "volunteers",
    resourceId: id,
    req,
    oldValues: existing,
    newValues: {
      isActive,
    },
  });

  return updated;
};

export default {
  getAll,
  getById,
  create,
  getStatus,
  verify,
  webhook,
  updateStatus
};