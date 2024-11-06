export const ResquestResponse = {
  success(data = []) {
    return {
      data,
      error: false,
      success: true,
      message: null,
    };
  },
  error(message = "Ups!, Lo sentimos ocurrio un error inesperado.") {
    return {
      data: [],
      error: true,
      success: false,
      message,
    };
  },
};
