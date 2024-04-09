import { getUserById } from "./services/users.js";
import { ErrorException } from "./utils/ErrorException.js";
import { fromBase64 } from "./utils/base64.js";
import { getStoreById } from "./services/stores.js";
import { createLinkTrack, getLinkTrack } from "./services/linkTracks.js";
import { getCashbackByIdAndStore } from "./services/cashbacks.js";
import { generateLink, generateTrackerInfo } from "./services/trackerInfo.js";
import { getStoreConfigs } from "./services/storeConfigs.js";
import { newUserStoreLog } from "./services/userStoreLog.js";
import { getPartnerById } from "./services/partners.js";
import CryptoJS from "crypto-js";
import pkg from "pg";
import {
  getBrowserName,
  getOperativeSystemFromRequest,
} from "./utils/getMetadata.js";

export const handler = async (event) => {
  const { queryStringParameters } = event;
  const { Client } = pkg;

  // Metadata
  const userAgent = event.headers["User-Agent"];
  const isMobile = userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
  const operativeSystem = getOperativeSystemFromRequest(userAgent);
  const browser = getBrowserName(userAgent);

  const client = new Client({
    user: process.env.PGUSER || "iwana_cashback",
    host:
      process.env.PGHOST ||
      "iwanacashback.csapwwufkkn0.us-east-1.rds.amazonaws.com",
    database: process.env.PGDATABASE || "iwana",
    password: process.env.PGPASSWORD || "IwAnA128379823$%cashBaCk$)#",
    port: 5432,
  });

  try {
    await client.connect((err) => {
      if (err) {
        throw new ErrorException({
          httpStatus: 500,
          message: "Internal Server Error",
          error: err,
        });
      }
    });

    const user = await getUserFromRequest(queryStringParameters, client);
    const store = await getStoreFromRequest(queryStringParameters, client);
    const cashback = await getCashbackFromRequest(
      queryStringParameters,
      store,
      client
    );
    const provider = getProviderFromRequest(queryStringParameters, client);
    const partner = await getPartnerFromRequest(queryStringParameters, client);
    const image =
      null === store?.image
        ? ""
        : process.env.S3_ROUTE ||
          "https://iwana.s3.us-east-2.amazonaws.com" + "/" + store.image;
    const sourceIP = event?.requestContext?.identity?.sourceIp;
    const tokenContent = `${user.id}-${store.id}-${sourceIP}`;
    let csrfToken;

    do {
      csrfToken = CryptoJS.HmacSHA1(tokenContent, `${new Date()}`).toString();
    } while (
      await getLinkTrack({ condition: `token = '${csrfToken}'` }, client)
    );

    console.log("new link track...");
    /* Creación del linkTrack */
    const linkTrack = await createLinkTrack(
      user,
      store,
      cashback,
      partner,
      sourceIP,
      csrfToken,
      client
    );

    console.log("get store config...");
    /* Get config store IF store type === 3 (Iwana) for generate link */
    const storeConfigs =
      store.store_type_id === 3 ? await getStoreConfigs(store, client) : null;

    console.log("new tracker info...");
    /* Generar tracker info, para separar la capa lógica, los componentes se juntan en una capa auxiliar que guarda los datos para el tracker */
    const trackerInfo = await generateTrackerInfo(
      user,
      store,
      storeConfigs,
      cashback,
      partner,
      linkTrack,
      client
    );

    console.log("generate link...");
    /* Genera el link que se necesita inyectar a la distintas páginas */
    const link = await generateLink(
      user,
      store,
      linkTrack,
      cashback,
      trackerInfo,
      storeConfigs
    );

    console.log("new user store log...");
    /* Logea al usuario */
    await newUserStoreLog(
      user,
      store,
      linkTrack,
      provider,
      browser,
      operativeSystem,
      isMobile,
      client
    );
    const data = {
      usuario: user,
      tienda: store,
      imagen: image,
      link,
    };
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return response;
  } catch (err) {
    return {
      statusCode: err.httpStatus || 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(err),
    };
  }
};

/**
 * Extrae el ID User desde el elemento base64 que está en el request y luego lo busca en la BD
 *
 * @param queryParams
 *
 * @return User
 */
const getUserFromRequest = async (queryParams, client) => {
  try {
    const encodedUserId = queryParams.ru;
    if (!encodedUserId) {
      throw new ErrorException({
        httpStatus: 400,
        message: "Párametro con el User ID no encontrado",
        error: "Bad request",
      });
    }
    const userId = fromBase64(encodedUserId);
    const user = await getUserById(userId, client);
    return user;
  } catch (err) {
    throw err;
  }
};

/**
 * Extrae el ID Store desde el elemento base64 que está en el request y luego lo busca en la BD
 *
 * @param queryParams
 *
 * @return Store
 */
const getStoreFromRequest = async (queryParams, client) => {
  try {
    const encodedStoreId = queryParams.rt;
    if (!encodedStoreId) {
      throw new ErrorException({
        httpStatus: 400,
        message: "Párametro con el Store ID no encontrado",
        error: "Bad request",
      });
    }
    const storeId = fromBase64(encodedStoreId);
    const store = await getStoreById(storeId, client);
    return store;
  } catch (err) {
    throw err;
  }
};

/**
 * Extrae el ID Cashback desde el elemento base64 que está en el request y luego lo busca en la BD
 *
 * @param queryParams
 * @param Store
 *
 * @return Cashback|null
 */
const getCashbackFromRequest = async (queryParams, store, client) => {
  try {
    const encodedCashbackId = queryParams.rc;
    if (!encodedCashbackId || encodedCashbackId === "null") {
      return null;
    }
    const cashbackId = fromBase64(encodedCashbackId);
    const cashback = await getCashbackByIdAndStore(cashbackId, store, client);
    return cashback;
  } catch (err) {
    throw err;
  }
};

/**
 * Extrae el proveedor del cliente desde el elemento base64 que está en el request
 * @param queryParams
 * @param Store
 *
 * @return Cashback|null
 */
const getProviderFromRequest = (queryParams) => {
  const provider = queryParams.rr;
  const providersAvailable = ["web", "extension", "veggo", "fintonic"];
  try {
    if (!provider) return null;
    if (!providersAvailable.includes(provider)) {
      return null;
    }
    return provider.toLowerCase();
  } catch (err) {
    throw err;
  }
};

/**
 * Extrae el Partner ID desde el elemento base64 que está en el request y luego lo busca en la BD
 *
 * @param queryParams
 * @param Store
 *
 * @return Cashback|null
 */
const getPartnerFromRequest = async (queryParams, client) => {
  try {
    const encodedPartnerId = queryParams.rp;
    if (!encodedPartnerId || encodedPartnerId === "null") {
      return null;
    }
    const partnerId = fromBase64(encodedPartnerId);
    const partner = await getPartnerById(partnerId, client);
    return partner;
  } catch (err) {
    throw err;
  }
};
