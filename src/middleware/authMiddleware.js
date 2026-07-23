const prisma      = require('../config/prisma');
const tokenService = require('../services/tokenService');
const response    = require('../shared/utils/response');
const { MESSAGES } = require('../constants');

/**
 * authenticate — verify Bearer JWT, attach req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
      return response.unauthorized(res, MESSAGES.UNAUTHORIZED);

    const token = header.split(' ')[1];

    let decoded;
    try {
      decoded = tokenService.verifyAccess(token);
    } catch (e) {
      const msg = e.name === 'TokenExpiredError' ? MESSAGES.TOKEN_EXPIRED : MESSAGES.INVALID_TOKEN;
      return response.unauthorized(res, msg);
    }

    const user = await prisma.user.findUnique({
      where:  { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive)
      return response.unauthorized(res, 'User not found or deactivated');

    req.user = user;
    next();
  } catch {
    return response.unauthorized(res, 'Authentication failed');
  }
};

/**
 * authorize — restrict to roles
 * Usage: authorize('ADMIN')  or  authorize('ADMIN', 'MANAGER')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role))
    return response.forbidden(res, MESSAGES.FORBIDDEN);
  next();
};

module.exports = { authenticate, authorize };
