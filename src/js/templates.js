import { icons } from './icons.js';

export const timeline = `
    <section id="cssanim-timeline">
        <ul class="cssanim__timeline"></ul>
    </section>
`;

export const timelineObject = `
    <li class="cssanim__object" data-selector=":selector">
        <button name="object.move" type="button">
            <div class="cssanim__icon" data-icon="object" style="background-color::color"></div>
            <span><strong>#:index</strong><em>:selector</em></span>
        </button>
        <ol class="cssanim__keyframes">
            <li class="cssanim__grid">
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
                <div class="cssanim__line"></div>
            </li>
        </ol>
        <nav class="cssanim__controls cssanim__controls--horizontal">
            <button name="keyframe.add" type="button" title="Add keyframe">
                <span class="cssanim__icon cssanim__icon--text">${icons.add}</span>
            </button>
            <button name="anim.props" type="button" title="Animation properties">
                <span class="cssanim__icon cssanim__icon--text">${icons.edit}</span>
            </button>
            <button name="object.remove" type="button" title="Remove object">
                <span class="cssanim__icon cssanim__icon--text">${icons.remove}</span>
            </button>
        </nav>
    </li>
`;

export const timelineKeyFrame = `
    <li class="cssanim__keyframe" style="left::position%">
        <button name="keyframe.edit" type="button" title="+Show">
            <div class="cssanim__icon" data-icon="keyframe"></div>
        </button>
        <div class="cssanim__position" data-orientation=":orientation">
            <span>:position</span>
            <strong>%</strong>
        </div>
    </li>
`;

export const timelineProps = `
    <dialog id="cssanim-props" open>
        <nav class="cssanim__actions">
            <div class="cssanim__title">
                <div class="cssanim__icon" data-icon="props"></div>
                <span>Keyframe properties</span>
            </div>
            <button name="props.close" type="button" title="Hide properties">
                <span>Hide</span>
                <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
            </button>
        </nav>
        <div class="cssanim__controls cssanim__controls--vertical">
            <ol class="cssanim__props">
                <li class="cssanim__prop cssanim__prop--time-position">
                    <label for="keyframe-time">Time (s|ms)</label>
                    <input id="keyframe-time" type="text" name="keyframe.time" value=":time" placeholder="Time (s|ms)" />
                    <input id="keyframe-position" type="number" name="keyframe.position" value=":position" min="0" max="100" step="0.01" placeholder="Position" />
                    <label for="keyframe-position">%</label>
                </li>
            </ol>
            <nav class="cssanim__actions">
                <button name="keyframe.remove" type="button" title="Remove keyframe">
                    <span class="cssanim__icon cssanim__icon--text">${icons.remove}</span>
                    <span>Remove keyframe</span>
                </button>
                <button name="prop.add" type="button" title="Add property">
                    <span class="cssanim__icon cssanim__icon--text">${icons.add}</span>
                    <span>Add property</span>
                </button>
            </nav>
        </div>
    </dialog>
`;

export const timelineProp = `
    <li class="cssanim__prop">
        <input type="text" name="prop.name" value=":name" placeholder="Name">
        <input type="text" name="prop.value" value=":value" placeholder="Value" disabled>
        <button name="prop.remove" type="button" title="Remove property">
            <span class="cssanim__icon cssanim__icon--text">${icons.remove}</span>
        </button>
    </li>
`;

export const animationProps = `
    <dialog id="cssanim-props" open>
        <nav class="cssanim__actions">
            <div class="cssanim__title">
                <div class="cssanim__icon" data-icon="props"></div>
                <span>Animation properties</span>
            </div>
            <button name="props.close" type="button" title="Hide properties">
                <span>Hide</span>
                <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
            </button>
        </nav>
        <div class="cssanim__controls cssanim__controls--vertical">
            <ol class="cssanim__props">
                <li class="cssanim__prop">
                    <label for="cssanim-props-name">Name</label>
                    <input id="cssanim-props-name" type="text" name="name" value=":name" placeholder="Name" />
                    <button name="clear.name" type="button" title="Remove property">
                        <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
                    </button>
                </li>
                <li class="cssanim__prop">
                    <label for="cssanim-props-duration">Duration</label>
                    <input id="cssanim-props-duration" type="text" name="duration" value=":duration" placeholder="Duration (s|ms)" />
                    <button name="clear.duration" type="button" title="Remove property">
                        <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
                    </button>
                </li>
                <li class="cssanim__prop">
                    <label for="cssanim-props-delay">Delay</label>
                    <input id="cssanim-props-delay" type="text" name="delay" value=":delay" placeholder="Delay" />
                    <button name="clear.delay" type="button" title="Remove property">
                        <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
                    </button>
                </li>
                <li class="cssanim__prop">
                    <label for="cssanim-props-iteration">Iteration count</label>
                    <input id="cssanim-props-iteration" type="text" name="iteration" value=":iteration" placeholder="Iteration count" />
                    <button name="clear.iteration" type="button" title="Remove property">
                        <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
                    </button>
                </li>
                <li class="cssanim__prop">
                    <label for="cssanim-props-direction">Direction</label>
                    <input id="cssanim-props-direction" type="text" name="direction" value=":direction" placeholder="Direction" />
                    <button name="clear.direction" type="button" title="Remove property">
                        <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
                    </button>
                </li>
                <li class="cssanim__prop">
                    <label for="cssanim-props-timing">Timing function</label>
                    <input id="cssanim-props-timing" type="text" name="timing" value=":timing" placeholder="Timing function" />
                    <button name="clear.timing" type="button" title="Remove property">
                        <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
                    </button>
                </li>
                <li class="cssanim__prop">
                    <label for="cssanim-props-mode">Fill mode</label>
                    <input id="cssanim-props-mode" type="text" name="mode" value=":mode" placeholder="Fill mode" />
                    <button name="clear.mode" type="button" title="Remove property">
                        <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
                    </button>
                </li>
            </ol>
        </div>
    </dialog>
`;

export const animationCSS = `
    <dialog id="cssanim-props" open>
        <nav class="cssanim__actions">
            <div class="cssanim__title">
                <div class="cssanim__icon" data-icon="logo"></div>
                <span>Animation CSS</span>
            </div>
            <button name="anim.close" type="button" title="Hide CSS">
                <span>Hide</span>
                <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
            </button>
        </nav>
        <div class="cssanim__controls cssanim__controls--vertical">
            <textarea name="anim.css"></textarea>
            <nav class="cssanim__actions">
                <button name="anim.copy" type="button" title="Copy animation CSS">
                    <span class="cssanim__icon cssanim__icon--text">${icons.add}</span>
                    <span>Copy CSS</span>
                </button>
            </nav>
        </div>
    </dialog>
`;

export const animationImport = `
    <dialog id="cssanim-props" open>
        <nav class="cssanim__actions">
            <div class="cssanim__title">
                <div class="cssanim__icon" data-icon="logo"></div>
                <span>Import CSS</span>
            </div>
            <button name="anim.close" type="button" title="Hide CSS">
                <span>Hide</span>
                <span class="cssanim__icon cssanim__icon--text">${icons.close}</span>
            </button>
        </nav>
        <div class="cssanim__controls cssanim__controls--vertical">
            <label for="cssanim-import">Import your animation css</label>
            <textarea id="cssanim-import" name="css.import">
@keyframes animation-0 {
  0% {
    left: 0;
    transform: translateX(0);
  }
  100% {
    left: 100%;
    transform: translateX(-100%);
  }
}
#o1 {
  animation: animation-0 2s ease infinite alternate;
}
@keyframes animation-1 {
  0% {
    top: 0;
    transform: translateY(0);
  }
  100% {
    top: 100%;
    transform: translateY(-100%);
  }
}
#o2 {
  animation: animation-1 2s ease infinite alternate;
}
            </textarea>
            <label class="ws-wrap">Every @keyframes object requires one resolvable selector with an animation property to import.</label>
            <nav class="cssanim__actions">
                <button name="anim.import" type="button" title="Import animation CSS">
                    <span class="cssanim__icon cssanim__icon--text">${icons.import}</span>
                    <span>Import CSS</span>
                </button>
            </nav>
        </div>
    </dialog>
`;

export const renderCSS = `<style id="cssanim-style" type="text/css">:root</style>`;

export const controls = `
    <section id="cssanim-controls" data-orientation="right">
        <button name="ctrl.orientation" class="cssanim__logo">
            <div class="cssanim__icon cssanim__icon--text">${icons.left}</div>
            <span>cssanim</span>
            <div class="cssanim__icon cssanim__icon--text">${icons.right}</div>
        </button>
        <nav class="cssanim__controls cssanim__controls--vertical">
            <button name="anim.props" type="button" title="Animation global properties">
                <span class="cssanim__icon cssanim__icon--text">${icons.edit}</span>
                <span>Animation</span>
            </button>
            <button name="object.new" type="button" title="Select object for timeline">
                <span class="cssanim__icon cssanim__icon--text">${icons.search}</span>
                <span>Object</span>
            </button>
            <button name="css.show" type="button" title="Show animation CSS">
                <span class="cssanim__icon cssanim__icon--text">${icons.copy}</span>
                <span>Show CSS</span>
            </button>
            <button name="css.import" type="button" title="Import animation CSS">
                <span class="cssanim__icon cssanim__icon--text">${icons.import}</span>
                <span>Import CSS</span>
            </button>
            <button name="anim.play" type="button" title="Play animation">
                <span class="cssanim__icon cssanim__icon--text">${icons.play}</span>
                <span>Play</span>
            </button>
            <button name="anim.stop" type="button" title="Stop animation" style="display:none">
                <span class="cssanim__icon cssanim__icon--text">${icons.stop}</span>
                <span>Stop</span>
            </button>
        </nav>
    </section>
`;
