import { ErrorException } from "../utils/ErrorException.js";

export const getStoreById = async (storeId, client) => {
  const statement = `SELECT json_agg(stores.*) as store, json_agg(countries.*) as country, json_agg(affiliate_networks.*) as affiliate_network FROM stores INNER JOIN countries on stores.pais_id = countries.id LEFT JOIN affiliate_networks ON stores.affiliate_network_id = affiliate_networks.id WHERE stores.id = ${storeId};`;
  try {
    const queryResults = await client.query(statement);
    if (queryResults.rowCount === 0) {
      throw new ErrorException({
        httpStatus: 404,
        message: "Tienda no encontrada",
        error: "Tienda no encontrada",
      });
    }
    const results = queryResults.rows[0];
    const store = results?.store[0];
    const country = results?.country[0]?.name;
    const affiliate_network = results?.affiliate_network[0];
    const storeData = {
      ...store,
      country,
      affiliate_network,
    };
    return storeData;
  } catch (err) {
    throw new ErrorException({
      httpStatus: err?.httpStatus || 500,
      message: "Error al buscar la tienda",
      error: err,
    });
  }
};
