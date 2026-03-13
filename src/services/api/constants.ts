const apiPrefix = 'api'

/*
* USUARIO
*/
// LOGIN
export const CONST_ENDPOINT_LOGIN_USUARIO = `${apiPrefix}/usuario/login`;
// REGISTER
export const CONST_ENDPOINT_REGISTER_USUARIO = `${apiPrefix}/usuario/register`;
// UPDATE USUARIO
export const CONST_ENDPOINT_UPDATE_USUARIO = `${apiPrefix}/usuario`;

/*
* CONTACTO
*/
export const CONST_ENDPOINT_CONTACTO = `${apiPrefix}/contacto`;

/*
* PRODUCTOS CLIENTES
*/
// GET, POST, PUT, PATCH AND DELETE PRODUCTO CLIENTE
export const CONST_ENDPOINT_PRODUCTOS_CLIENTES = `${apiPrefix}/productos-clientes`;
// PATCH BULK PRODUCTO CLIENTE
export const CONST_ENDPOINT_PRODUCTOS_CLIENTES_BULK = `${apiPrefix}/productos-clientes/bulkUpdate`;

/*
* PRODUCTOS CLIENTES EXTRAS
*/
export const CONST_ENDPOINT_PRODUCTOS_EXTRAS = `${apiPrefix}/productos-extras`;