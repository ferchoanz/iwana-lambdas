import { ErrorException } from "../utils/ErrorException.js";
/**
 * 
 * @param {String} partnerId 
 * @param {import('pg').Client} client 
 * @return {Object}
 */
export const getPartnerById = async (partnerId, client) => {
  const table = "partners";
  const columns = "*";
  const conditions = `id = ${partnerId}`;
  const statement = `SELECT ${columns} FROM ${table} WHERE ${conditions}`;
  try {
    const queryResults = await client.query(statement);
    const results = queryResults.rows[0];
    return results;
  } catch (err) {
    throw new ErrorException({
      httpStatus: err?.httpStatus || 500,
      message: "Error al buscar el partner",
      error: err,
    });
  }
};
