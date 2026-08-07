import volunteerService from "../service/volunteerService";
import { writeAudit } from "../../../services/auditService";
import {
  parsePagination,
  buildPaginationMeta,
} from "../../../shared/helpers/pagination";
import {
  AUDIT_ACTIONS,
  VOLUNTEER_SORT_FIELDS,
} from "../../../constants";

export const getAll = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const sortBy = VOLUNTEER_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { rows, total } = await volunteerService.findAll({
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
  const volunteer = await volunteerService.findById(id);

  if (!volunteer) {
    throw {
      statusCode: 404,
      message: "Volunteer not found",
    };
  }

  return volunteer;
};

export const create = async (body: any, req: any) => {
  const volunteer = await volunteerService.create(body);

  await writeAudit({
    action: AUDIT_ACTIONS.CREATE,
    resource: "volunteers",
    resourceId: volunteer.id,
    req,
    newValues: volunteer,
  });

  return volunteer;
};

export const update = async (id: string, body: any, req: any) => {
  const existing = await volunteerService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Volunteer not found",
    };
  }

  const updated = await volunteerService.update(id, body);

  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    resource: "volunteers",
    resourceId: id,
    req,
    oldValues: existing,
    newValues: updated,
  });

  return updated;
};

export const remove = async (id: string, req: any) => {
  const existing = await volunteerService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Volunteer not found",
    };
  }

  await volunteerService.remove(id);

  await writeAudit({
    action: AUDIT_ACTIONS.DELETE,
    resource: "volunteers",
    resourceId: id,
    req,
    oldValues: existing,
  });
};

export const updateStatus = async (
  id: string,
  isActive: boolean,
  req: any
) => {
  const existing = await volunteerService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Volunteer not found",
    };
  }

  const updated = await volunteerService.updateStatus(id, isActive);

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
  update,
  updateStatus,
  remove,
};