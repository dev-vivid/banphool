import beneficiaryService from "../service/beneficiaryService";
import { writeAudit } from "../../../services/auditService";
import {
  parsePagination,
  buildPaginationMeta,
} from "../../../shared/helpers/pagination";
import {
  AUDIT_ACTIONS,
  BENEFICIARY_APPLICATION_SORT_FIELDS,
} from "../../../constants";

export const getAll = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const sortBy = BENEFICIARY_APPLICATION_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { rows, total } = await beneficiaryService.findAll({
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
  const beneficiary = await beneficiaryService.findById(id);

  if (!beneficiary) {
    throw {
      statusCode: 404,
      message: "Beneficiaryy application not found",
    };
  }

  return beneficiary;
};

export const create = async (body: any, req: any) => {
  const beneficiary = await beneficiaryService.create(body);

  await writeAudit({
    action: AUDIT_ACTIONS.CREATE,
    resource: "beneficiarys",
    resourceId: beneficiary.id,
    req,
    newValues: beneficiary,
  });

  return beneficiary;
};

export const update = async (id: string, body: any, req: any) => {
  const existing = await beneficiaryService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Beneficiaryy application not found",
    };
  }

  const updated = await beneficiaryService.update(id, body);

  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    resource: "beneficiarys",
    resourceId: id,
    req,
    oldValues: existing,
    newValues: updated,
  });

  return updated;
};

export const remove = async (id: string, req: any) => {
  const existing = await beneficiaryService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Beneficiaryy application not found",
    };
  }

  await beneficiaryService.remove(id);

  await writeAudit({
    action: AUDIT_ACTIONS.DELETE,
    resource: "beneficiarys",
    resourceId: id,
    req,
    oldValues: existing,
  });
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};