/**
 * IE11 template polyfill
 * https://github.com/webcomponents/polyfills/blob/master/packages/template/template.js
 * https://www.npmjs.com/package/template-polyfill
 */

/**
 * Convert string to html
 *
 * @param {string} str - HTML source string
 * @param {boolean} multiple - Contains multiple nodes, default: true
 *
 * @return {null|HTMLElement|NodeList} - Element or collection of elements
 */
export function str2node( str, multiple = true ) {
    str = str.trim();
    if ( str.length ) {
        let template = document.createElement( 'template' );
        if ( 'content' in template ) {
            template.innerHTML = str;
            if ( multiple ) {
                return template.content.childNodes;
            }
            return template.content.firstChild;
        }
    }
    return null;
}
