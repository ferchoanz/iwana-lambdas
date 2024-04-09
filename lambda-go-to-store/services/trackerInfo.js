import { ErrorException } from "../utils/ErrorException.js";

export const generateTrackerInfo = async (
  user,
  store,
  storeConfigs,
  cashback,
  partner,
  linkTrack,
  client
) => {
  const table = "tracker_info";
  const cashback_id = cashback ? cashback.id : null;
  const tienda_id = store.id;
  const usuario_id = user.id;
  const link_track_id = linkTrack.id;
  const partner_id = partner ? partner.id : null;
  const is_iwana = true;
  const pais_id = store.pais_id;
  const {
    codigo_producto_carro,
    codigo_producto_carro_attr,
    precio_producto_carro,
    precio_producto_carro_attr,
    cantidad_producto_carro,
    cantidad_producto_carro_attr,
    imagen_producto_carro,
    imagen_producto_carro_attr,
    boton_carrito_carro,
    boton_final_carro,
    codigo_producto_en_producto,
    codigo_producto_en_producto_attr,
    imagen_producto_en_producto,
    imagen_producto_en_producto_attr,
    nombre_producto_en_producto,
    nombre_producto_en_producto_attr,
    descripcion_producto_en_producto,
    descripcion_producto_en_producto_attr,
    categoria_producto_en_producto,
    categoria_producto_en_producto_attr,
    boton_producto_en_producto,
    codigo_producto_comprar,
    codigo_producto_comprar_attr,
    precio_producto_comprar,
    precio_producto_comprar_attr,
    cantidad_producto_comprar,
    cantidad_producto_comprar_attr,
    boton_final_comprar,
    codigo_orden_en_orden,
    codigo_orden_en_orden_attr,
    pagina_gracias,
    link_carro,
    elemento_seleccionado,
    parents,
  } = getConfigStoreInfo(storeConfigs);

  const insertStatement = `
    INSERT INTO ${table} (
      cashback_id,
      tienda_id, 
      usuario_id, 
      link_track_id, 
      partner_id, 
      is_iwana, 
      pais_id, 
      codigo_producto_carro,
      codigo_producto_carro_attr, 
      precio_producto_carro, 
      precio_producto_carro_attr,
      cantidad_producto_carro, 
      cantidad_producto_carro_attr,
      imagen_producto_carro, 
      imagen_producto_carro_attr,
      boton_carrito_carro, 
      boton_final_carro, 
      codigo_producto_en_producto, 
      codigo_producto_en_producto_attr,
      imagen_producto_en_producto, 
      imagen_producto_en_producto_attr,
      nombre_producto_en_producto, 
      nombre_producto_en_producto_attr,
      descripcion_producto_en_producto,
      descripcion_producto_en_producto_attr, 
      categoria_producto_en_producto,
      categoria_producto_en_producto_attr,
      boton_producto_en_producto, 
      codigo_producto_comprar,
      codigo_producto_comprar_attr,
      precio_producto_comprar, 
      precio_producto_comprar_attr,
      cantidad_producto_comprar, 
      cantidad_producto_comprar_attr, 
      boton_final_comprar, 
      codigo_orden_en_orden,
      codigo_orden_en_orden_attr,
      pagina_gracias, 
      link_carro,
      elemento_seleccionado, 
      parents, 
      created_at,
      updated_at
    ) VALUES (
      ${cashback_id},
      ${tienda_id},
      ${usuario_id},
      ${link_track_id},
      ${partner_id},
      ${is_iwana},
      ${pais_id},
      ${codigo_producto_carro},
      ${codigo_producto_carro_attr},
      ${precio_producto_carro},
      ${precio_producto_carro_attr},
      ${cantidad_producto_carro},
      ${cantidad_producto_carro_attr},
      ${imagen_producto_carro},
      ${imagen_producto_carro_attr},
      ${boton_carrito_carro},
      ${boton_final_carro},
      ${codigo_producto_en_producto},
      ${codigo_producto_en_producto_attr},
      ${imagen_producto_en_producto},
      ${imagen_producto_en_producto_attr},
      ${nombre_producto_en_producto},
      ${nombre_producto_en_producto_attr},
      ${descripcion_producto_en_producto},
      ${descripcion_producto_en_producto_attr},
      ${categoria_producto_en_producto},
      ${categoria_producto_en_producto_attr},
      ${boton_producto_en_producto},
      ${codigo_producto_comprar},
      ${codigo_producto_comprar_attr},
      ${precio_producto_comprar},
      ${precio_producto_comprar_attr},
      ${cantidad_producto_comprar},
      ${cantidad_producto_comprar_attr},
      ${boton_final_comprar},
      ${codigo_orden_en_orden},
      ${codigo_orden_en_orden_attr},
      ${pagina_gracias},
      ${link_carro},
      ${elemento_seleccionado},
      ${parents},
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    ) RETURNING *;
  `;
  try {
    console.log('Tracker info statement: ', insertStatement);
    const queryResults = await client.query(insertStatement);
    const results = queryResults.rows[0];
    return results;
  } catch (err) {
    throw new ErrorException({
      httpStatus: err?.httpStatus || 500,
      message: "Error al registrar el tracker info",
      error: err,
    });
  }
};

const getConfigStoreInfo = (storeConfig) => {
  let trackerInfo = {};
  Object.assign(trackerInfo, {
    // Desde configuración 'en el carrito'
    codigo_producto_carro: storeConfig ? storeConfig.code_prod : null,
    codigo_producto_carro_attr: storeConfig ? storeConfig.code_prod_attr : null,
    precio_producto_carro: storeConfig ? storeConfig.price_prod : null,
    precio_producto_carro_attr: storeConfig
      ? storeConfig.price_prod_attr
      : null,
    cantidad_producto_carro: storeConfig ? storeConfig.quantity_prod : null,
    cantidad_producto_carro_attr: storeConfig
      ? storeConfig.quantity_prod_attr
      : null,
    imagen_producto_carro: storeConfig ? storeConfig.cart_image_prod : null,
    imagen_producto_carro_attr: storeConfig
      ? storeConfig.cart_image_prod_attr
      : null,
    boton_carrito_carro: storeConfig ? storeConfig.actuator_cart : null,
    boton_final_carro: storeConfig ? storeConfig.actuator_final : null,
    // Desde configuración 'en el producto'
    codigo_producto_en_producto: storeConfig
      ? storeConfig.code_detail_prod
      : null,
    codigo_producto_en_producto_attr: storeConfig
      ? storeConfig.code_detail_prod_attr
      : null,
    imagen_producto_en_producto: storeConfig ? storeConfig.image_prod : null,
    imagen_producto_en_producto_attr: storeConfig
      ? storeConfig.image_prod_attr
      : null,
    nombre_producto_en_producto: storeConfig ? storeConfig.name_prod : null,
    nombre_producto_en_producto_attr: storeConfig
      ? storeConfig.name_prod_attr
      : null,
    descripcion_producto_en_producto: storeConfig
      ? storeConfig.description_prod
      : null,
    descripcion_producto_en_producto_attr: storeConfig
      ? storeConfig.description_prod_attr
      : null,
    categoria_producto_en_producto: storeConfig
      ? storeConfig.categories_prod
      : null,
    categoria_producto_en_producto_attr: storeConfig
      ? storeConfig.categories_prod_attr
      : null,
    boton_producto_en_producto: storeConfig
      ? storeConfig.actuator_product
      : null,
    // Desde configuración 'comprar producto'
    codigo_producto_comprar: storeConfig ? storeConfig.code_prod_final : null,
    codigo_producto_comprar_attr: storeConfig
      ? storeConfig.code_prod_final_attr
      : null,
    precio_producto_comprar: storeConfig ? storeConfig.price_prod_final : null,
    precio_producto_comprar_attr: storeConfig
      ? storeConfig.price_prod_final_attr
      : null,
    cantidad_producto_comprar: storeConfig
      ? storeConfig.quantity_prod_final
      : null,
    cantidad_producto_comprar_attr: storeConfig
      ? storeConfig.quantity_prod_final_attr
      : null,
    boton_final_comprar: storeConfig
      ? storeConfig.actuator_product_final
      : null,
    // Desde configuración 'en la orden'
    codigo_orden_en_orden: storeConfig ? storeConfig.orden_code : null,
    codigo_orden_en_orden_attr: storeConfig
      ? storeConfig.orden_code_attr
      : null,
    pagina_gracias: storeConfig ? storeConfig.link_final : null,
    // Desde configuración 'ni idea'
    link_carro: storeConfig ? storeConfig.link_cart : null,
    elemento_seleccionado: storeConfig ? storeConfig.element_select : null,
    parents: storeConfig ? storeConfig.parents : null,
  });
  const cleanedTrackerInfo = parseOrNullifyValues(trackerInfo);
  return cleanedTrackerInfo;
};

/* Add single quotes on critical values (class names, html elements, etc...) or nullify if it's already null */
const parseOrNullifyValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (!value) {
      obj[key] = null;
      return;
    }
    const scapedDataProp = `${obj[key]}`.replace(/'/g, "''");
    obj[key] = `'${scapedDataProp}'`;
    return;
  });
  return obj;
};

export const generateLink = async (
  user,
  store,
  linkTrack,
  cashback,
  trackerInfo,
  storeConfigs
) => {
  const storeType = store.store_type_id;
  let stringLink = "";
  switch (storeType) {
    case 2:
      stringLink = configureLinkStoreAffiliate(
        user,
        store,
        linkTrack,
        cashback
      );
      break;
    case 3: // Tienda Iwana
      stringLink = configureLinkStoreIwana(
        store,
        cashback,
        trackerInfo,
        storeConfigs
      );
      break;
    case 4: // Tienda ADMITAD
      stringLink = configureLinkStoreAdmitad(user, store, linkTrack, cashback);
      break;
    case 5: // Tienda Soicos
      stringLink = configureLinkStoreSoicos(user, store, linkTrack, cashback);
      break;
    case 6: // Tienda AWIN
      stringLink = configureLinkTiendaAwin(user, store, linkTrack, cashback);
      break;
    default:
      break;
  }
  return stringLink.replace('"', "'");
};

const configureLinkStoreAffiliate = (user, store, linkTrack, cashback) => {
  let link = null;
  if (cashback) {
    link = parseBaseURL(cashback.link);
  } else {
    link = parseBaseURL(store.link);
  }
  const affiliateData = store.affiliate_network.data;
  const data = {
    data1: linkTrack.id,
    data2: user.id,
    link_track_id: linkTrack.id,
    user_id: user.id,
    affiliate_id: affiliateData.affiliate_id,
    user_email: user.email,
  };
  for (const [key, value] of Object.entries(data)) {
    link = link.replace(`[${key}]`, value);
  }
  return link;
};
/**
 * Crea el link que se usa para las tiendas tipo Iwana, los datos son limpiados y luego
 * se realiza un encode para poder enviarlo y que pueda detectarlo el script tracking.
 *
 * @param TrackerInfo $trackerInfo
 *
 * @return string
 */

const configureLinkStoreIwana = (
  store,
  cashback,
  trackerInfo,
  storeConfigs
) => {
  const data = arrayDataForIwanaTrack(trackerInfo, store, storeConfigs);
  let stringLink = "";

  for (const [key, value] of Object.entries(data)) {
    const stringValue = value ? value.toString() : "null";
    const cleanValue = encodeURIComponent(stringValue.trim());
    const cleanName = encodeURIComponent(key.trim());
    stringLink += `${cleanName}=${cleanValue}&`;
  }
  // General el link, corta los bordes blancos y elimina el último caracter &
  const cleanLink = stringLink.trim().slice(0, -1);

  let url = "";
  let link = "";
  // Si existe cashback, retornar link de cashback
  if (cashback) {
    link = parseBaseURL(cashback.link);
    url = `${link}?${cleanLink}`;
    return url;
  }

  // Si no existe cashback, usar link de tienda
  link = parseBaseURL(store.link);

  const lastCharacters = link.slice(-2);

  if ("??" === lastCharacters) {
    const position = link.indexOf("??");
    const routeFixed = link.substring(0, position);
    url = `${routeFixed}&${cleanLink}`;
    return url;
  }
  url = `${link}?${cleanLink}`;
  return url;
};

/**
 * Parsea un link, si no tiene protocol http o si no posee un / al final
 *
 * @param string url
 *
 * @return string
 */
const parseBaseURL = (url) => {
  let finalUrl = "";
  if (!url.includes("https://") && !url.includes("http://"))
    finalUrl = `https://${url}`;
  else finalUrl = url;
  return finalUrl;
};

/**
 * Genera un link que se usa en las tiendas Admitad
 *
 * @param TrackerInfo $trackerInfo
 *
 * @return string
 */

const configureLinkStoreAdmitad = (user, store, linkTrack, cashback) => {
  const userId = user.id;
  const storeId = store.id;
  const linkTrackId = linkTrack.id;

  const userText = `subid=${userId}`;
  const storeText = `subid1=${storeId}`;
  const linkText = `subid3=${linkTrackId}`;

  const linkDataAffiliate = `${userText}&${storeText}&${linkText}`;
  const link = cashback ? cashback.link : store.link;
  return `${link}?${linkDataAffiliate}`;
};

/**
 * Genera un link que se usa en las tiendas Soicos
 *
 * @param TrackerInfo $trackerInfo
 *
 * @return string
 */
const configureLinkStoreSoicos = (user, store, linkTrack, cashback) => {
  const userId = user.id;
  const storeId = store.id;
  const linkTrackId = linkTrack.id;
  const userText = `trackerID=${userId}`;

  const linkDataAffiliate = `${userText};${storeId};${linkTrackId}`;

  if (!cashback) {
    const link = store.link;
    return `${link}?${linkDataAffiliate}`;
  }

  const link = cashback.link;
  const position = link.indexOf("?");
  if (position === -1) {
    return `${link}?${linkDataAffiliate}`;
  }

  const soicosUrl = link.substring(0, position);
  const route = link.substring(position + 1);

  return `${soicosUrl}?${linkDataAffiliate}&${route}`;
};

/**
 * Genera un link que se usa en las tiendas Awin
 *
 * @param TrackerInfo $trackerInfo
 *
 * @return string
 */

const configureLinkTiendaAwin = (user, store, linkTrack, cashback) => {
  const userId = user.id;
  const storeId = store.id;
  const linkTrackId = linkTrack.id;

  const userText = `clickref=${userId}`;
  const storeText = `clickref2=${storeId}`;
  const linkText = `clickref3=${linkTrackId}`;

  const linkDataAffiliate = `${userText}&${storeText}&${linkText}`;

  if (!cashback) {
    const link = store.link;
    const connector = link.includes('?') ? '&' : '?'; 
    return link + connector + linkDataAffiliate;
  }

  const link = cashback.link;
  const position = link.indexOf("?");
  if (!position) {
    return `${link}?${linkDataAffiliate}`;
  }

  const awinURL = link.substring(0, position);
  const route = link.substring(position + 1);

  return `${awinURL}?${linkDataAffiliate}&${route}`;
};

const arrayDataForIwanaTrack = (trackerInfo, store, storeConfig) => {
  console.log("trackerInfo: ", trackerInfo);
  let data = {};
  Object.assign(data, {
    is_iwana: trackerInfo.is_iwana,
    store_id: trackerInfo.tienda_id,
    user_id: trackerInfo.usuario_id,
    "iwana-id-track": trackerInfo.link_track_id,
    id: storeConfig ? storeConfig.id : null,
    pais_id: trackerInfo.pais_id,
    link_final: trackerInfo.pagina_gracias,
    image_prod: trackerInfo.imagen_producto_en_producto,
    code_prod: trackerInfo.codigo_producto_carro,
    name_prod: trackerInfo.nombre_producto_en_producto,
    description_prod: trackerInfo.descripcion_producto_en_producto,
    price_prod: trackerInfo.precio_producto_carro,
    quantity_prod: trackerInfo.cantidad_producto_carro,
    created_at: new Date(trackerInfo.created_at).toISOString(),
    updated_at: new Date(trackerInfo.updated_at).toISOString(),
    link_cart: trackerInfo.link_carro,
    image_prod_attr: trackerInfo.imagen_producto_en_producto_attr,
    code_prod_attr: trackerInfo.codigo_producto_carro_attr,
    name_prod_attr: trackerInfo.nombre_producto_en_producto_attr,
    description_prod_attr: trackerInfo.descripcion_producto_en_producto_attr,
    price_prod_attr: trackerInfo.precio_producto_comprar_attr,
    quantity_prod_attr: trackerInfo.cantidad_producto_carro_attr,
    actuator_cart: trackerInfo.boton_carrito_carro,
    actuator_final: trackerInfo.boton_final_carro,
    orden_code: trackerInfo.codigo_orden_en_orden,
    orden_code_attr: trackerInfo.codigo_orden_en_orden_attr,
    categories_prod: trackerInfo.categoria_producto_en_producto,
    categories_prod_attr: trackerInfo.categoria_producto_en_producto_attr,
    code_detail_prod: trackerInfo.codigo_producto_en_producto,
    code_detail_prod_attr: trackerInfo.codigo_producto_en_producto_attr,
    actuator_product: trackerInfo.boton_producto_en_producto,
    element_select: trackerInfo.elemento_seleccionado,
    parents: trackerInfo.parents,
    actuator_product_final: trackerInfo.boton_final_comprar,
    price_prod_final: trackerInfo.precio_producto_comprar,
    price_prod_final_attr: trackerInfo.precio_producto_comprar_attr,
    quantity_prod_final: trackerInfo.cantidad_producto_comprar,
    quantity_prod_final_attr: trackerInfo.cantidad_producto_comprar_attr,
    code_prod_final: trackerInfo.codigo_producto_comprar,
    code_prod_final_attr: trackerInfo.codigo_producto_comprar_attr,
    cart_image_prod: trackerInfo.imagen_producto_carro,
    cart_image_prod_attr: trackerInfo.imagen_producto_carro_attr,
    link: store.url_store,
  });
  return data;
};