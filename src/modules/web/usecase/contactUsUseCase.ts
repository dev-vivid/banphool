import contactUsService from "../service/contactUsService";
import { sendEmail } from "../../../services/emailService";
import { writeAudit } from "../../../services/auditService";

import {
  parsePagination,
  buildPaginationMeta,
} from "../../../shared/helpers/pagination";

import {
  AUDIT_ACTIONS,
  CONTACT_US_SORT_FIELDS,
} from "../../../constants";

export const getAll = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const sortBy = CONTACT_US_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { rows, total } = await contactUsService.findAll({
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
  const contact = await contactUsService.findById(id);

  if (!contact) {
    throw {
      statusCode: 404,
      message: "Contact request not found",
    };
  }

  return contact;
};

export const create = async (body: any, req: any) => {
  const contact = await contactUsService.create(body);

  try {
    console.log("========== CONTACT EMAIL ==========");
    console.log("Record ID :", contact.id);
    console.log("Admin Mail:", process.env.ADMIN_EMAIL);

    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: "New Contact Us Request",
      html: `
        <h2>New Contact Request</h2>

        <table border="1" cellpadding="8" cellspacing="0">
          <tr>
            <td><b>Name</b></td>
            <td>${contact.name}</td>
          </tr>

          <tr>
            <td><b>Email</b></td>
            <td>${contact.email}</td>
          </tr>

          <tr>
            <td><b>Phone</b></td>
            <td>${contact.phone}</td>
          </tr>

          <tr>
            <td><b>Address</b></td>
            <td>${contact.address}</td>
          </tr>

          <tr>
            <td><b>Remarks</b></td>
            <td>${contact.remarks ?? ""}</td>
          </tr>
        </table>
      `,
    });

    console.log("Email Success");
    console.log(result);

    await contactUsService.updateEmailStatus(
      contact.id,
      true,
      "SENT"
    );

    console.log("Database updated -> SENT");
  } catch (err: any) {
    console.error("EMAIL FAILED");
    console.error(err);

    await contactUsService.updateEmailStatus(
      contact.id,
      false,
      "FAILED",
      err.message || String(err)
    );

    console.log("Database updated -> FAILED");
  }

  await writeAudit({
    action: AUDIT_ACTIONS.CREATE,
    resource: "contactUs",
    resourceId: contact.id,
    req,
    newValues: contact,
  });

  return await contactUsService.findById(contact.id);
};


export const update = async (
  id: string,
  body: any,
  req: any
) => {
  const existing = await contactUsService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Contact request not found",
    };
  }

  const updated = await contactUsService.update(id, body);

  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    resource: "contactUs",
    resourceId: id,
    req,
    oldValues: existing,
    newValues: updated,
  });

  return updated;
};

export const remove = async (
  id: string,
  req: any
) => {
  const existing = await contactUsService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Contact request not found",
    };
  }

  await contactUsService.remove(id);

  await writeAudit({
    action: AUDIT_ACTIONS.DELETE,
    resource: "contactUs",
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
  const existing = await contactUsService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Volunteer not found",
    };
  }

  const updated = await contactUsService.updateStatus(id, isActive);

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