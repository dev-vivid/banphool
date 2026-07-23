const { v4: uuidv4 } = require('uuid');
const prisma  = require('../config/prisma');
const logger  = require('../shared/utils/logger');
const { getClientIp } = require('../shared/helpers/ipHelper');

/**
 * AuditService — writes audit records to DB
 * Never throws — audit failure must never crash the main request
 *
 * @param {object} opts
 * @param {string}  opts.action      - AUDIT_ACTIONS constant
 * @param {string}  opts.resource    - entity name e.g. 'products'
 * @param {string}  [opts.resourceId]
 * @param {object}  [opts.oldValues]
 * @param {object}  [opts.newValues]
 * @param {object}  opts.req         - Express request (user + IP)
 * @param {string}  [opts.status]    - 'SUCCESS' | 'FAILURE'
 */
const writeAudit = async ({
  action,
  resource,
  resourceId = null,
  oldValues  = null,
  newValues  = null,
  req,
  status     = 'SUCCESS',
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        id:         uuidv4(),
        userId:     req.user?.id    || null,
        userEmail:  req.user?.email || null,
        action,
        resource,
        resourceId,
        oldValues:  oldValues || undefined,
        newValues:  newValues || undefined,
        ipAddress:  getClientIp(req),
        userAgent:  req.headers['user-agent'] || null,
        status,
      },
    });
  } catch (err) {
    logger.error('Audit log write failed', { error: err.message });
  }
};

module.exports = { writeAudit };
