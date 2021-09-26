/**
 * Round value to specific decimals
 *
 * @param {number} value - Number to round
 * @param {number} decimals - Number of decimals, default: 2
 *
 * @return {number} - Rounded number
 */
export function round( value, decimals = 2 ) {
    decimals = Math.pow( 10, decimals );
    return Math.round( value * decimals ) / decimals;
}
