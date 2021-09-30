import { str2node } from './fn/str2node.js';
import { simpleReplace } from './fn/simpleReplace.js';
import { round } from './fn/round.js';
import { rand } from './fn/rand.js';
import { getAnimationObject } from './fn/getAnimationObject.js';
import {
    timeline,
    timelineObject,
    timelineKeyFrame,
    timelineProps,
    timelineProp,
    animationProps,
    animationCSS,
    animationImport,
    controls,
    renderCSS,
} from "./templates.js";
const CSSJSON = require( 'cssjson' );

export class CssAnim {

    #dom = {};
    #index = 0;
    #drag = {
        active : null,
        startX : null,
        minX : 3,
        dragged : false,
        reset : 100,
        omin : 33.3333,
        omax : 66.6666,
    }
    #objects = [];
    #props = {
        name : 'animation',
        duration : '10s',
        iteration : 'infinite',
    };

    #animationProperties = [
        [ 'name', /^[-_\w\d]+$/, true ],
        [ 'duration', /^\d+(s|ms)$/, true ],
        [ 'timing', /^(initial|inherit|linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end|steps\([\d]+(?:,(start|end))\)|cubic-bezier\([ ]*[\\.\d]+[ ]*,[ ]*[\\.\d]+[ ]*,[ ]*[\\.\d]+[ ]*,[ ]*[\\.\d]+[ ]*\))$/, false ],
        [ 'delay', /^\d+(s|ms)$/, false ],
        [ 'iteration', /^([\d]+|infinite|initial|inherit)$/, false ],
        [ 'direction', /^(normal|reverse|alternate|alternate-reverse|initial|inherit)$/, false ],
        [ 'mode', /^(none|forwards|backwards|both|initial|inherit)$/, false ],
    ];

    #initialized = false;

    init() {
        if ( this.#initialized ) {
            return;
        }
        this.#initialized = true;
        this.#dom.app = str2node( '<div id="cssanim"></div>', false );
        document.body.appendChild( this.#dom.app );
        this.#dom.timeline = str2node( timeline, false );
        this.#dom.app.appendChild( this.#dom.timeline );
        this.#dom.controls = str2node( controls, false );
        this.#dom.app.appendChild( this.#dom.controls );
        this.#dom.content = this.#dom.timeline.querySelector( '.cssanim__timeline' );
        this.#dom.orientation = this.#dom.controls.querySelector( '[name="ctrl.orientation"]' );
        this.#dom.animProps = this.#dom.controls.querySelector( '[name="anim.props"]' );
        this.#dom.addObject = this.#dom.controls.querySelector( '[name="object.new"]' );
        this.#dom.showCSS = this.#dom.controls.querySelector( '[name="css.show"]' );
        this.#dom.importCSS = this.#dom.controls.querySelector( '[name="css.import"]' );
        this.#dom.play = this.#dom.controls.querySelector( '[name="anim.play"]' );
        this.#dom.stop = this.#dom.controls.querySelector( '[name="anim.stop"]' );

        this.#bind();
    }

    #bind() {

        window.addEventListener( 'mousemove', e => {
            if ( !this.#drag.active ) {
                return;
            }
            const deltaX = e.clientX - this.#drag.startX;
            if ( Math.abs( deltaX ) < this.#drag.minX ) {
                return;
            }

            this.#drag.dragged = true;
            this.#drag.active.e_props.blur();
            const parent = this.#drag.active.element.parentElement.getBoundingClientRect();
            let px = this.#drag.startX + deltaX - parent.left;

            // Enforce min max
            if ( px < 0 ) {
                px = 0;
            } else if ( px > parent.width ) {
                px = parent.width;
            }
            const percent = px / parent.width * 100;

            this.#updateKeyFramePosition( this.#drag.active, percent );

            /*if ( this.#drag.active.activeProps ) {
                this.#drag.active.activeProps.position.value = percent;
            }*/
        } );

        window.addEventListener( 'mouseup', () => {
            if ( this.#drag.active ) {
                this.#sortKeyFrames( this.#drag.active.parent );
            }
            this.#drag.active = null;
            setTimeout( () => {
                this.#drag.dragged = false;
            }, this.#drag.reset );
        } );

        this.#dom.orientation.addEventListener( 'click', e => {
            e.preventDefault();
            const orientation = this.#dom.controls.getAttribute( 'data-orientation' )
                === 'left' ? 'right' : 'left';
            this.#dom.controls.setAttribute( 'data-orientation', orientation );
        } );
        this.#dom.animProps.addEventListener( 'click', e => {
            e.preventDefault();
            this.#editAnimationProperties( this.#props );
        } );
        this.#dom.addObject.addEventListener( 'click', e => {
            e.preventDefault();
            this.#createAnimationObject();
        } );
        this.#dom.showCSS.addEventListener( 'click', e => {
            e.preventDefault();
            this.#showCSS();
        } );
        this.#dom.importCSS.addEventListener( 'click', e => {
            e.preventDefault();
            this.#importCSS();
        } );
        this.#dom.play.addEventListener( 'click', e => {
            e.preventDefault();
            this.#play();
        } );
        this.#dom.stop.addEventListener( 'click', e => {
            e.preventDefault();
            this.#stop();
        } );
    }

    #play() {
        document.getElementById( 'cssanim-style' )?.remove();
        this.#dom.play.style.display = 'none';
        this.#dom.stop.style.display = '';
        const css = this.#renderCSS();
        const style = str2node( simpleReplace( renderCSS, { root : css } ), false );
        this.#dom.app.appendChild( style );
    }

    #stop() {
        this.#dom.play.style.display = '';
        this.#dom.stop.style.display = 'none';
        document.getElementById( 'cssanim-style' )?.remove();
    }

    #createAnimationObject( arg_selector ) {
        let override;
        if ( arg_selector ) {
            override = { selector : arg_selector, selected : document.querySelector( arg_selector ) };
        }
        const { selector, selected } = override || getAnimationObject();
        if ( !selector || !selected ) {
            return;
        }
        for ( let i = 0; i < this.#objects.length; i++ ) {
            if ( this.#objects[ i ].selector === selector || this.#objects[ i ].element === selected ) {
                alert( `The object has already been selected with: ${this.#objects[ i ].selector} at #${this.#objects[ i ].index}!` );
                return;
            }
        }
        const oTimeline = {
            index : this.#index,
            selector,
            element : str2node( simpleReplace( timelineObject, {
                index : this.#index,
                selector,
                color : 'rgb(' + [ rand( 0, 255 ), rand( 0, 255 ), rand( 0, 255 ) ].join( ',' ) + ')',
            } ), false ),
            props : {},
            children : [],
        };
        oTimeline.e_remove = oTimeline.element.querySelector( '[name="object.remove"]' );
        oTimeline.e_props = oTimeline.element.querySelector( '[name="anim.props"]' );
        oTimeline.e_add = oTimeline.element.querySelector( '[name="keyframe.add"]' );
        oTimeline.frames = oTimeline.element.querySelector( '.cssanim__keyframes' );

        oTimeline.e_remove.addEventListener( 'click', e => {
            e.preventDefault();
            this.#clearActiveProps();
            this.#removeAnimationObject( oTimeline );
        } );
        oTimeline.e_props.addEventListener( 'click', e => {
            e.preventDefault();
            this.#editAnimationProperties( oTimeline.props, oTimeline );
        } );
        oTimeline.e_add.addEventListener( 'click', e => {
            e.preventDefault();
            this.#addObjectKeyFrame( oTimeline );
        } );

        this.#objects.push( oTimeline );
        this.#dom.content.appendChild( oTimeline.element );
        this.#index++;

        return oTimeline;
    }

    #removeAnimationObject( oTimeline ) {
        let index;
        for ( let i = 0; i < this.#objects; i++ ) {
            if ( this.#objects[ i ].index === oTimeline.index ) {
                index = i;
                break;
            }
        }
        this.#objects.splice( index, 1 )[ 0 ];
        oTimeline.element.remove();
    }

    #getNewKeyFramePosition( oTimeline ) {
        let position = null;
        if ( !oTimeline.children.filter( oKeyFrame => oKeyFrame.position === 0 ).length ) {
            position = 0;
        } else if ( !oTimeline.children.filter( oKeyFrame => oKeyFrame.position === 100 ).length ) {
            position = 100;
        }
        if ( position === null ) {
            const inbetween = { index : 0, distance : 0 };
            for ( let i = 1; i < oTimeline.children.length; i++ ) {
                const distance = oTimeline.children[ i ].position - oTimeline.children[ i - 1 ].position;
                if ( distance > inbetween.distance ) {
                    inbetween.index = i - 1;
                    inbetween.distance = distance;
                }
            }
            return oTimeline.children[ inbetween.index ].position + inbetween.distance / 2;
        }
        return position;
    }

    #addObjectKeyFrame( oTimeline, arg_position ) {
        const position = typeof arg_position === 'number' ? arg_position : this.#getNewKeyFramePosition( oTimeline );
        const oKeyFrame = {
            element : str2node( simpleReplace( timelineKeyFrame, {
                position,
                orientation : this.#getOrientation( position ),
            } ), false ),
            position : position,
            time : null,
            props : {},
            parent : oTimeline,
            activeProps : null,
        };
        oKeyFrame.e_props = oKeyFrame.element.querySelector( '[name="keyframe.edit"]' );
        oKeyFrame.e_info = oKeyFrame.element.querySelector( '.cssanim__position' );
        oKeyFrame.e_show = oKeyFrame.e_info.querySelector( 'span' );

        oKeyFrame.element.addEventListener( 'mousedown', e => {
            this.#drag.startX = e.clientX;
            this.#drag.active = oKeyFrame;
        } );
        oKeyFrame.e_props.addEventListener( 'click', e => {
            e.preventDefault();
            if ( !this.#drag.dragged ) {
                this.#editKeyFrameProperties( oKeyFrame );
                oKeyFrame.element.classList.add( 'cssanim__keyframe--active' );
            }
        } );

        oTimeline.frames.appendChild( oKeyFrame.element );
        oTimeline.children.push( oKeyFrame );
        this.#sortKeyFrames( oTimeline );
        this.#updateKeyFramePosition( oKeyFrame, position );

        if ( typeof arg_position !== 'number' ) {
            oKeyFrame.e_props.click();
        }
        return oKeyFrame;
    }

    #clearActiveProps( oKeyFrame ) {
        document.getElementById( 'cssanim-props' )?.remove();
        this.#clearActiveKeyFrames();
        if ( oKeyFrame?.activeProps ) {
            oKeyFrame.activeProps = null;
        }
    }

    #editKeyFrameProperties( oKeyFrame ) {
        this.#clearActiveProps( oKeyFrame );
        const oProperties = {
            __type : 'PropertiesObject',
            element : str2node( simpleReplace( timelineProps, {
                position : oKeyFrame.position,
                time : oKeyFrame.time === null ? '' : oKeyFrame.time,
            } ), false ),
            parent : oKeyFrame,
        };
        oProperties.props = oProperties.element.querySelector( '.cssanim__props' );
        oProperties.position = oProperties.element.querySelector( '[name="keyframe.position"]' );
        oProperties.time = oProperties.element.querySelector( '[name="keyframe.time"]' );
        this.#dom.app.appendChild( oProperties.element );
        oKeyFrame.activeProps = oProperties;

        // Add existing properties
        const keys = Object.entries( oKeyFrame.props );
        for ( let i = 0; i < keys.length; i++ ) {
            this.#addKeyFrameProperty( oProperties, keys[ i ][ 0 ], keys[ i ][ 1 ] );
        }

        // Add first property if none defined
        if ( !keys.length ) {
            this.#addKeyFrameProperty( oProperties );
        }
        oProperties.position.addEventListener( 'change', () => {
            this.#updateKeyFramePosition( oKeyFrame, oProperties.position.value );
        } );
        oProperties.time.addEventListener( 'change', () => {
            this.#updateKeyFramePosition( oKeyFrame, oProperties.time.value );
        } );
        oProperties.element.querySelector( '[name="keyframe.remove"]' )
            .addEventListener( 'click', e => {
                e.preventDefault();
                this.#clearActiveProps( oKeyFrame );
                this.#removeKeyFrameObject( oKeyFrame )
            } );
        oProperties.element.querySelector( '[name="prop.add"]' )
            .addEventListener( 'click', e => {
                e.preventDefault();
                this.#addKeyFrameProperty( oProperties );
            } );
        oProperties.element.querySelector( '[name="props.close"]' )
            .addEventListener( 'click', e => {
                e.preventDefault();
                this.#clearActiveProps( oKeyFrame );
                this.#clearActiveKeyFrames();
            } );
    }

    #removeKeyFrameObject( oKeyFrame ) {
        let index;
        for ( let i = 0; i < oKeyFrame.parent.children.length; i++ ) {
            if ( oKeyFrame.parent.children[ i ].index === oKeyFrame.parent.index ) {
                index = i;
                break;
            }
        }
        oKeyFrame.parent.children.splice( index, 1 )[ 0 ];
        oKeyFrame.element.remove();
    }

    #parsePosition( position ) {
        const to = typeof position;
        let unit = null, ms = null;
        if ( to !== 'number' ) {
            if ( to === 'string' ) {
                if ( position.slice( -2 ) === 'ms' ) {
                    unit = 'ms';
                } else if ( position.slice( -1 ) === 's' ) {
                    unit = 's';
                }
            }
            ms = position = parseFloat( position );
            if ( unit === 's' ) {
                ms *= 1000;
            }
        }
        return { unit, position, ms };
    }

    #updateKeyFramePosition( oKeyFrame, i_position ) {
        let { unit, position, ms } = this.#parsePosition( i_position );
        if ( Number.isNaN( position ) ) {
            return;
        }

        let totalDuration = null;
        const animDuration = this.#parsePosition( oKeyFrame.parent.props.duration );
        if ( animDuration.unit && animDuration.position && !Number.isNaN( animDuration.position ) ) {
            totalDuration = animDuration;
        } else {
            const globalDuration = this.#parsePosition( this.#props.duration );
            if ( globalDuration.unit && globalDuration.position && !Number.isNaN( globalDuration.position ) ) {
                totalDuration = globalDuration;
            }
        }

        if ( unit ) {
            if ( totalDuration && totalDuration.ms > ms ) {
                position = ms / totalDuration.ms * 100;
            }
        } else {
            if ( oKeyFrame.time ) {
                unit = this.#parsePosition( oKeyFrame.time ).unit;
            }
            if ( totalDuration ) {
                ms = totalDuration.ms * position / 100;
            }
        }

        if ( position < 0 ) {
            position = 0;
        } else if ( position > 100 ) {
            position = 100;
        }

        unit = unit || totalDuration?.unit || 'ms';
        const displayTime = unit === 's' ? round( ms / 1000, 3 ) : Math.round( ms );

        oKeyFrame.position = position;
        oKeyFrame.time = displayTime + unit;
        oKeyFrame.element.style.left = position + '%'

        // Enforce 2 decimals
        const r = ( round( position ) + '' ).split( '.' );
        if ( !r[ 1 ] ) {
            r[ 1 ] = '00';
        } else if ( r[ 1 ].length < 2 ) {
            r[ 1 ] += '0';
        }
        oKeyFrame.e_show.innerText = r.join( '.' );
        oKeyFrame.e_info.setAttribute( 'data-orientation', this.#getOrientation( position ) );

        if ( oKeyFrame.activeProps ) {
            oKeyFrame.activeProps.position.value = round( position, 6 );
            oKeyFrame.activeProps.time.value = oKeyFrame.time;
        }
    }

    #clearActiveKeyFrames() {
        const cssClass = 'cssanim__keyframe--active';
        const actives = this.#dom.app.querySelectorAll( '.' + cssClass );
        for ( let i = 0; i < actives.length; i++ ) {
            actives[ i ].classList.remove( cssClass );
        }
    }

    #addKeyFrameProperty( oProperties, name = '', value = '' ) {
        const oProperty = {
            cname : name,
            cvalue : value,
            element : str2node( simpleReplace( timelineProp, { name, value : value === null ? '' : value } ), false ),
            parent : oProperties,
        };
        oProperty.name = oProperty.element.querySelector( '[name="prop.name"]' );
        oProperty.value = oProperty.element.querySelector( '[name="prop.value"]' );
        oProperties.props.appendChild( oProperty.element );

        oProperty.value.disabled = !oProperty.name.value?.length;

        oProperty.name.addEventListener( 'change', () => {
            this.#updateProperty( oProperty );
            oProperty.value.disabled = !oProperty.name.value?.length;
        } );
        oProperty.name.addEventListener( 'input', () => {
            oProperty.value.disabled = !oProperty.name.value?.length;
        } );
        oProperty.value.addEventListener( 'change', () => {
            this.#updateProperty( oProperty );
        } );
        oProperty.value.addEventListener( 'click', e => {
            if ( oProperty.value.disabled ) {
                e.preventDefault();
                oProperty.name.focus();
            }
        } );
        oProperty.element.querySelector( '[name="prop.remove"]' )
            .addEventListener( 'click', e => {
                e.preventDefault();
                this.#removeKeyFrameProperty( oProperty );
            } );
        oProperty.element.querySelector( 'input' ).focus();
    }

    #updateProperty( oProperty ) {
        let name = null, value = null;

        const input_name = oProperty.name.value;
        if ( input_name?.length ) {
            name = input_name;
        } else {
            return;
        }

        if ( name !== oProperty.cname ) {
            delete oProperty.parent.parent.props[ oProperty.cname ];
        }

        const input_value = oProperty.value.value;
        if ( input_value?.length ) {
            value = input_value;
        }

        oProperty.parent.parent.props[ name ] = value;
        oProperty.cname = name;
        oProperty.cvalue = value;
    }

    #removeKeyFrameProperty( oProperty ) {
        delete oProperty.parent.parent.props[ oProperty.cname ];
        oProperty.element.remove();
        if ( oProperty.parent.props.children.length < 2 ) {
            this.#addKeyFrameProperty( oProperty.parent );
        }
    }

    #getOrientation( position ) {
        return position < this.#drag.omin ? 'left' : ( position > this.#drag.omax ? 'right' : 'center' );
    }

    #editAnimationProperties( props, parent ) {
        this.#clearActiveProps();
        const allProps = {
            delay: "",
            direction: "",
            duration: "",
            iteration: "",
            mode: "",
            name: "",
            timing: "",
        };
        Object.assign( allProps, props );
        const oAnim = {
            __type : 'AnimationPropertiesObject',
            element : str2node( simpleReplace( animationProps, allProps ), false ),
            parent,
        };
        oAnim.inputs = oAnim.element.querySelectorAll( 'input' );
        oAnim.clears = oAnim.element.querySelectorAll( '[name^="clear"]' );
        this.#dom.app.appendChild( oAnim.element );

        for ( let i = 0; i < oAnim.inputs.length; i++ ) {
            oAnim.inputs[ i ].addEventListener( 'change', e => {
                const prop = e.target.name;
                const value = e.target.value;
                if ( value && value.length ) {
                    props[ prop ] = value;
                } else {
                    delete props[ prop ];
                }
            } );
        }

        for ( let i = 0; i < oAnim.clears.length; i++ ) {
            oAnim.clears[ i ].addEventListener( 'click', e => {
                let button = e.target;
                if ( !( button instanceof HTMLButtonElement ) ) {
                    button = button.closest( 'button' );
                }
                if ( button ) {
                    delete props[ button.name.split( '.' )[ 1 ] ];
                    const input = button.previousElementSibling;
                    if ( input instanceof HTMLInputElement ) {
                        input.value = '';
                        input.focus();
                    }
                }
            } );
        }

        oAnim.element.querySelector( '[name="props.close"]' )
            .addEventListener( 'click', e => {
                e.preventDefault();
                this.#clearActiveProps();
            } );
    }

    #showCSS() {
        this.#clearActiveProps();
        const oCSS = {
            __type : 'CSSObject',
            element : str2node( simpleReplace( animationCSS, {} ), false ),
        };
        this.#dom.app.appendChild( oCSS.element );
        oCSS.output = oCSS.element.querySelector( '[name="anim.css"]' );
        oCSS.output.value = this.#renderCSS();
        oCSS.output.select();
        oCSS.output.setSelectionRange( 0, 99999 );

        oCSS.element.querySelector( '[name="anim.copy"]' )
            .addEventListener( 'click', e => {
                e.preventDefault();
                const m = 'Copied CSS to clipboard!';
                oCSS.output.select();
                oCSS.output.setSelectionRange( 0, 99999 );
                navigator.clipboard.writeText( oCSS.output.value ).then( () => {
                    alert( m );
                } ).catch( () => {
                    document?.execCommand( 'copy' );
                    alert( m );
                } );
            } );

        oCSS.element.querySelector( '[name="anim.close"]' )
            .addEventListener( 'click', e => {
                e.preventDefault();
                this.#clearActiveProps();
            } );
    }

    #renderCSS() {
        const css = [];
        for ( let i = 0; i < this.#objects.length; i++ ) {
            const oTimeline = this.#objects[ i ];
            const compiledProps = { ...this.#props };
            Object.assign( compiledProps, oTimeline.props );
            if ( this.#props.name?.length && oTimeline.props.name?.length ) {
                compiledProps.name = this.#props.name + '_' + oTimeline.props.name;
            } else {
                compiledProps.name = compiledProps.name + '-' + oTimeline.index;
            }
            css.push( this.#renderCSSKeyFrames( oTimeline, compiledProps ) );
            css.push( this.#renderCSSSelector( oTimeline, compiledProps ) );
        }
        return css.join( '\n' );
    }

    #renderCSSSelector( oTimeline, compiledProps ) {
        const { name, duration, timing, delay, iteration, direction, mode } = compiledProps;
        const cssProps = [ name, duration, timing, delay, iteration, direction, mode ];
        const filtered = cssProps.filter( v => v !== undefined && v !== null && ( v + '' ).length );
        return `${oTimeline.selector} {\n  animation: ${filtered.join( ' ' )};\n}`;
    }

    #renderCSSKeyFrames( oTimeline, compiledProps ) {
        this.#sortKeyFrames( oTimeline );
        const frames = [];
        for ( let i = 0; i < oTimeline.children.length; i++ ) {
            const frame = oTimeline.children[ i ];
            frames.push( `  ${frame.position}% {\n${this.#renderCSSProps( frame.props )}\n  }` );
        }
        return `@keyframes ${compiledProps.name} {\n${frames.join( '\n' )}\n}`;
    }

    #renderCSSProps( props ) {
        const entries = Object.entries( props );
        const cssProps = [];
        for ( let i = 0; i < entries.length; i++ ) {
            const [ k, v ] = entries[ i ];
            if ( v !== null && ( v + '' ).length ) {
                cssProps.push( `    ${k}: ${v};` );
            }
        }
        return cssProps.join( '\n' );
    }

    #sortKeyFrames( oTimeline ) {
        oTimeline.children.sort( ( a, b ) => {
            if ( a.position < b.position) {
                return -1;
            }
            if ( a.position > b.position ) {
                return 1;
            }
            return 0;
        } );
    }

    #importCSS() {
        this.#clearActiveProps();
        const oCSS = {
            element : str2node( simpleReplace( animationImport, {} ), false ),
        };
        oCSS.import = oCSS.element.querySelector( '[name="css.import"]' );
        this.#dom.app.appendChild( oCSS.element );
        oCSS.import.focus();

        oCSS.element.querySelector( '[name="anim.import"]' )
            .addEventListener( 'click', e => {
                e.preventDefault();
                try {
                    const data = this.#readCSS( oCSS.import.value );
                    if ( data ) {
                        this.#clearActiveProps();
                        alert( `Imported ${data.anims} with ${data.frames} frames.` );
                    }
                } catch ( e ) {
                    alert( e );
                }
            } );

        oCSS.element.querySelector( '[name="anim.close"]' )
            .addEventListener( 'click', e => {
                e.preventDefault();
                this.#clearActiveProps();
            } );
    }

    #readCSS( css ) {
        let src, err;
        try {
            src = CSSJSON.toJSON( css );
        } catch ( e ) {
            err = e;
        }

        if ( !err && ( !src || !src.children || !Object.keys( src.children ).length ) ) {
            err = 'CSS source invalid or empty!';
        }

        if ( err ) {
            alert( err );
            return;
        }

        const oAnimations = [];
        const oSelectors = [];

        const keyframePrefix = '@keyframes';
        const keys = Object.keys( src.children );
        for ( let i = 0; i < keys.length; i++ ) {
            const k = keys[ i ];
            if ( k.substr( 0, keyframePrefix.length ) === keyframePrefix ) {
                const anim = this.#getCSSAnimation( k, src.children[ k ].children );
                if ( anim ) {
                    oAnimations.push( anim );
                }
            } else {
                const selector = this.#getCSSSelector( k, src.children[ k ] );
                if ( selector ) {
                    oSelectors.push( selector );
                }
            }
        }
        return this.#importData( oAnimations, oSelectors );
    }

    #importData( oAnimations, oSelectors ) {
        let anims = 0, frames = 0;
        for ( let i = 0; i < oAnimations.length; i++ ) {
            for ( let j = 0; j < oSelectors.length; j++ ) {
                if ( oAnimations[ i ].name === oSelectors[ j ].props.name ) {
                    const oTimeline = this.#createAnimationObject( oSelectors[ j ].selector );
                    if ( oTimeline ) {
                        anims++;
                        Object.assign( oTimeline.props, oSelectors[ j ].props );
                        for ( let k = 0; k < oAnimations[ i ].frames.length; k++ ) {
                            const oKeyFrame = this.#addObjectKeyFrame( oTimeline, oAnimations[ i ].frames[ k ].position );
                            if ( oKeyFrame ) {
                                frames++;
                                Object.assign( oKeyFrame.props, oAnimations[ i ].frames[ k ].props );
                            }
                        }
                    }
                }
            }
        }
        return { anims, frames };
    }

    #getCSSAnimation( def, data ) {
        const name = def.split( /[ ]+/ ).pop();
        const frames = [];
        const keys = Object.keys( data );
        for ( let i = 0; i < keys.length; i++ ) {
            let position = keys[ i ];
            if ( position === 'from' ) {
                position = '0';
            } else if ( position === 'to' ) {
                position = '100%';
            }
            position = parseFloat( position );
            frames.push( { position, props : data[ keys[ i ] ].attributes } );
        }
        if ( frames.length ) {
            return { name, frames };
        }
        return null;
    }

    #getCSSSelector( selector, data ) {
        if ( data.attributes && data.attributes.animation ) {
            const props = {};
            const input = data.attributes.animation.split( /[ ]+/ );
            let current = null;
            for ( let i = 0; i < this.#animationProperties.length; i++ ) {
                if ( !current ) {
                    current = input.shift();
                    if ( !current ) {
                        break;
                    }
                }
                const [ name, rgx, req ] = this.#animationProperties[ i ];
                if ( current.match( rgx ) ) {
                    props[ name ] = current;
                    current = null;
                } else if ( req ) {
                    throw new Error( `Animation property missing required value: ${name}` );
                }
            }
            return { selector, props };
        }
        return null;
    }
}
