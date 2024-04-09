import { ErrorException } from "../utils/ErrorException.js";

export const createLinkTrack = async (
  user,
  store,
  cashback,
  partner,
  sourceIP,
  csrfToken,
  client
) => {
  const table = "links_track";
  const token = `'${csrfToken}'`;
  const user_id = user.id;
  const cashback_id = cashback ? cashback.id : null;
  const partner_id = partner ? partner.id : null;
  const store_id = store.id;
  const origin_ip = `'${sourceIP}'`;
  const pais_id = store.pais_id;
  const is_active = true;
  const is_used = false;

  const insertStatement = `
    INSERT INTO ${table} (
      token, 
      user_id, 
      cashback_id, 
      partner_id, 
      store_id, 
      origin_ip, 
      pais_id, 
      is_active, 
      is_used, 
      created_at, 
      updated_at
    ) VALUES (
      ${token},
      ${user_id},
      ${cashback_id},
      ${partner_id},
      ${store_id},
      ${origin_ip},
      ${pais_id},
      ${is_active},
      ${is_used},
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ) RETURNING *;
  `;

  try {
    const queryResults = await client.query(insertStatement);
    const results = queryResults.rows[0];
    return results;
  } catch (err) {
    throw new ErrorException({
      httpStatus: err?.httpStatus || 500,
      message: "Error al crear link track",
      error: err,
    });
  }
};

export const getLinkTrack = async ({ condition }, client) => {
  const table = "links_track";
  const statement = `
    SELECT id, token FROM ${table} WHERE ${condition};
  `;
  try {
    const queryResults = await client.query(statement);
    if (queryResults.rowCount === 0) {
      return null;
    }
    const results = queryResults.rows[0];
    return results;
  } catch (err) {
    throw new ErrorException({
      httpStatus: 500,
      message: "Error al buscar link track",
      error: err,
    });
  }
};
