export function getAnimationObject() {
    const m = 'Enter object selector:';
    const c = 'Retry and edit selector?';
    let selector, selected, last, err;
    while( !selector || !selected ) {
        try {
            selector = prompt( m, last );
            err = `No element found with: ${selector}!`;
            selected = document.querySelectorAll( selector );
            if ( selected && selected.length ) {
                if ( selected.length === 1 ) {
                    selected = selected[ 0 ];
                } else {
                    err = `Multiple (${selected.length}) elements found with: ${selector}!`;
                    selected = null;
                }
            } else {
                selected = null;
            }
        } catch ( e ) {}
        if ( selector && !selected ) {
            last = selector;
            alert( err );
        } else if ( !selected && !confirm( c ) ) {
            break;
        }
    }
    return { selector, selected };
}
