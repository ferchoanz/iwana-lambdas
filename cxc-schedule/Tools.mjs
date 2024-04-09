/**
 * @param {object} order 
 * @param {import('pg').Client} client 
 * @param {object} staticValues 
 * @return {object}
 */
export const loadMoreInfo = async (order, client, staticValues) => {
    const { store, order_states } = staticValues;
    const order_state = order_states.find(state => state.id == order.order_state_id);

    let user = await client.query(`SELECT * FROM users WHERE id = ${order.user_id} LIMIT 1`).catch(() => null);
    user = user?.rowCount ? user.rows[0] : null;
    let cashbacks_charged = await client.query(`SELECT * FROM cashbacks_charged WHERE order_id = ${order.id}`).catch(() => null);
    cashbacks_charged = cashbacks_charged?.rowCount ? cashbacks_charged.rows : [];
    for (const [index, charged] of cashbacks_charged.entries()) {
        let products = await client.query(`SELECT * FROM cashback_charged_prods WHERE cashback_charged_id = ${charged.id}`).catch(() => null);
        products = products?.rowCount ? products.rows : [];
        let cashback = await client.query(`SELECT * FROM cashbacks WHERE id = ${charged.cashback_id} LIMIT 1`).catch(() => null);
        cashback = cashback?.rowCount ? cashback.rows[0] : null;
        cashbacks_charged[index] = { ...charged, products, cashback };
    }

    return {
        ...order,
        store,
        user,
        order_state,
        cashbacks_charged
    };
};

/**
 * @param {string} key 
 * @param {string} value 
 * @return {string}
 */
export const jsonReplacer = (key, value) => {
    return String(value).includes(`'`) ? String(value).replace(/'/g, `''`) : value;
};
