export const ResquestResponse = {
  success(data = []) {
    return {
      data,
      error: false,
      succes: true,
      message: null,
    };
  },
  error(message = "Ups!, Lo sentimos ocurrio un error inesperado.") {
    return {
      data: [],
      error: true,
      succes: false,
      message,
    };
  },
};
