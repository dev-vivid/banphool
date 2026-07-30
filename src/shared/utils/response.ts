import { Request, Response } from "express";
import moment from "moment";

// Check if an object is an Express Request object
const isRequest = (obj: any): obj is Request => {
  return obj && typeof obj === "object" && ("protocol" in obj || "originalUrl" in obj);
};

const getBaseResponse = (req?: Request) => {
  if (!req || !isRequest(req)) {
    return {
      timestamp: moment().format("DD-MM-YYYY HH:mm"),
    };
  }
  try {
    const host = req.get("host") || "localhost";
    return {
      timestamp: moment().format("DD-MM-YYYY HH:mm"),
      path: `${req.protocol}://${host}${req.originalUrl}`,
    };
  } catch {
    return {
      timestamp: moment().format("DD-MM-YYYY HH:mm"),
    };
  }
};

export const success = (
  res: Response,
  reqOrData: any = {},
  dataOrMsg: any = {},
  messageOrStatus?: string | number,
  statusCode: number = 200,
  code: string = "success"
) => {
  let req: Request | undefined;
  let data: any = {};
  let message = "Success";
  let status = statusCode;

  if (isRequest(reqOrData)) {
    req = reqOrData;
    data = dataOrMsg;
    if (typeof messageOrStatus === "string") {
      message = messageOrStatus;
    } else if (typeof messageOrStatus === "number") {
      status = messageOrStatus;
    }
  } else {
    data = reqOrData;
    if (typeof dataOrMsg === "string") {
      message = dataOrMsg;
    }
    if (typeof messageOrStatus === "number") {
      status = messageOrStatus;
    }
  }

  return res.status(status).json({
    code,
    success: true,
    statusCode: status,
    message,
    ...getBaseResponse(req),
    data,
  });
};

export const created = (
  res: Response,
  reqOrData: any = {},
  dataOrMsg: any = {},
  message: string = "Created successfully"
) => {
  if (isRequest(reqOrData)) {
    return success(res, reqOrData, dataOrMsg, message, 201);
  } else {
    const msg = typeof dataOrMsg === "string" ? dataOrMsg : message;
    return success(res, reqOrData, msg, 201);
  }
};

export const paginated = (
  res: Response,
  reqOrData: any,
  listOrPagination: any,
  paginationOrMsg?: any,
  message: string = "Data fetched successfully"
) => {
  if (isRequest(reqOrData)) {
    const list = listOrPagination;
    const pagination = paginationOrMsg;
    return success(
      res,
      reqOrData,
      {
        totalRecords: pagination?.totalRecords ?? (pagination?.total || 0),
        list,
        pagination,
      },
      message
    );
  } else {
    const list = reqOrData;
    const pagination = listOrPagination;
    const msg = typeof paginationOrMsg === "string" ? paginationOrMsg : message;
    return success(
      res,
      {
        totalRecords: pagination?.totalRecords ?? (pagination?.total || 0),
        list,
        pagination,
      },
      msg
    );
  }
};

export const error = (
  res: Response,
  reqOrMsg: any = "Something went wrong",
  messageOrStatus: any = 500,
  statusCodeOrCode: any = "server_error",
  codeParam: string = "server_error"
) => {
  let req: Request | undefined;
  let message = "Something went wrong";
  let statusCode = 500;
  let code = "server_error";
  let errors: any = null;

  if (isRequest(reqOrMsg)) {
    req = reqOrMsg;
    message = typeof messageOrStatus === "string" ? messageOrStatus : "Something went wrong";
    statusCode = typeof statusCodeOrCode === "number" ? statusCodeOrCode : 500;
    code = typeof codeParam === "string" ? codeParam : "server_error";
  } else {
    message = typeof reqOrMsg === "string" ? reqOrMsg : "Something went wrong";
    if (typeof messageOrStatus === "number") {
      statusCode = messageOrStatus;
    }
    if (typeof statusCodeOrCode === "string") {
      code = statusCodeOrCode;
    } else if (statusCodeOrCode && typeof statusCodeOrCode === "object") {
      errors = statusCodeOrCode;
    }
  }

  const responseBody: any = {
    code,
    success: false,
    statusCode,
    message,
    ...getBaseResponse(req),
  };

  if (errors) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
};

export const notFound = (res: Response, msg = "Resource not found") => 
  error(res, msg, 404, "not_found");

export const badRequest = (res: Response, msg = "Bad request", errs?: any) => 
  error(res, msg, 400, errs || "bad_request");

export const unauthorized = (res: Response, msg = "Unauthorized") => 
  error(res, msg, 401, "unauthorized");

export const forbidden = (res: Response, msg = "Forbidden") => 
  error(res, msg, 403, "forbidden");

export const conflict = (res: Response, msg = "Conflict") => 
  error(res, msg, 409, "conflict");

export default {
  success,
  created,
  paginated,
  error,
  notFound,
  badRequest,
  unauthorized,
  forbidden,
  conflict,
};