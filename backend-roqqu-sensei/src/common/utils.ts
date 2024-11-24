export const createSuccessResponse = (data: any, message: string = '') => {
  return ({
    status: 'success',
    message: message,
    data,
  })
}

export const createErrorResponse = (message: string, data: any) => {
  return ({
    status: 'error',
    message: message,
    data,
  });
}