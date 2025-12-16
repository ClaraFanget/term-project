module.exports = {
  INVALID_BODY: {
    status: 400,
    code: "INVALID_BODY",
    message: "Request body is invalid",
  },

  INVALID_OBJECT_ID: {
    status: 400,
    code: "INVALID_OBJECT_ID",
    message: "Invalid ObjectId format",
  },

  UNAUTHORIZED: {
    status: 401,
    code: "UNAUTHORIZED",
    message: "Authentication required",
  },

  FORBIDDEN: {
    status: 403,
    code: "FORBIDDEN",
    message: "Access denied",
  },

  NOT_FOUND: {
    status: 404,
    code: "RESOURCE_NOT_FOUND",
    message: "Resource not found",
  },

  CONFLICT: {
    status: 409,
    code: "DUPLICATE_RESOURCE",
    message: "Resource already exists",
  },

  VALIDATION_ERROR: {
    status: 422,
    code: "VALIDATION_ERROR",
    message: "Validation failed",
  },

  INTERNAL_ERROR: {
    status: 500,
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  },
};
