import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";
import logger from "../shared/utils/logger";
import { getClientIp } from "../shared/helpers/ipHelper";

interface AuditOptions {
  action: string;
  resource: string;
  resourceId?: string | null;
  oldValues?: any;
  newValues?: any;
  req: any; // Using any to support custom properties like req.user
  status?: "SUCCESS" | "FAILURE";
}

/**
 * AuditService — writes audit records to DB
 * Never throws — audit failure must never crash the main request
 */
export const writeAudit = async ({
  action,
  resource,
  resourceId = null,
  oldValues = null,
  newValues = null,
  req,
  status = "SUCCESS",
}: AuditOptions): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        id: uuidv4(),
        userId: req.user?.id || null,
        userEmail: req.user?.email || null,
        action,
        resource,
        resourceId,
        oldValues: oldValues || undefined,
        newValues: newValues || undefined,
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"] || null,
        status,
      },
    });
  } catch (err: any) {
    logger.error("Audit log write failed", { error: err.message });
  }
};

export default { writeAudit };
