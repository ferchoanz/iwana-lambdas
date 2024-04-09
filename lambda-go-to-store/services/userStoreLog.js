import { ErrorException } from "../utils/ErrorException.js";

export const newUserStoreLog = async (
  user,
  store,
  linkTrack,
  provider,
  browser,
  operativeSystem,
  isMobile,
  client
) => {
  const table = "usuario_tienda_log";
  const usuario_id = user.id;
  const tienda_id = store.id;
  const proveedor = `'${provider}'`;
  const navegador = `'${browser}'`;
  const dispositivo = isMobile ? `'móvil'` : `'browser'`;
  const sistema_operativo = `'${operativeSystem}'`;
  const link_track_id = linkTrack.id;

  const insertStatement = `
    INSERT INTO ${table} (
      usuario_id, 
      tienda_id, 
      fecha_login, 
      proveedor, 
      navegador, 
      dispositivo, 
      sistema_operativo, 
      link_track_id
    ) VALUES (
      ${usuario_id},
      ${tienda_id},
      CURRENT_TIMESTAMP,
      ${proveedor},
      ${navegador},
      ${dispositivo},
      ${sistema_operativo},
      ${link_track_id}
    ) RETURNING *;
`;

  try {
    const queryResults = await client.query(insertStatement);
    const results = queryResults.rows[0];
    return results;
  } catch (err) {
    throw new ErrorException({
      httpStatus: err?.httpStatus || 500,
      message: "Error al logear al usuario",
      error: err,
    });
  }
};
