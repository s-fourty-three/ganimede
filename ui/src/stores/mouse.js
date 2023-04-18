import { readable, get } from 'svelte/store';

import {zoom} from './zoom.js';

export default readable({x:0, y:0}, (set) => {
	document.body.addEventListener("mousemove", move);
	
	function move(event) {
		set({
            x: Math.floor((event.clientX + window.scrollX) / get(zoom)),
            y: Math.floor((event.clientY + window.scrollY) / get(zoom))
		});
	}
	
	return () => {
		document.body.removeEventListener("mousemove", move);
	}
})