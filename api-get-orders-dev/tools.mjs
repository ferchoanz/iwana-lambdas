/**
 * @param {String} column column of where
 * @param {String} value value column
 * @return {String}
 */
export function andWhere(column, value) {
    if (value === null) {
        return '';
    }

    return `AND ${column} = '${value}' `;
}

/**
 * @param {String} column column of where
 * @param {Date} from order start date
 * @param {Date} to order end date
 * @return {String}
 */
export function andWhereBetween(column, from, to) {
    if (from === null) {
        return '';
    }

    if (to === null) {
        to = new Date().toISOString().split('T')[0];
    }

    return `AND ${column} BETWEEN '${from}' AND '${to}' `;
}