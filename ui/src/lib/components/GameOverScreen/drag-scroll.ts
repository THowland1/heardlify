export function dragscroll(element: HTMLElement) {
	let pos = { top: 0, left: 0, x: 0, y: 0 };
	const mouseDownHandler = function (e: MouseEvent) {
		pos = {
			// The current scroll
			left: element.scrollLeft,
			top: element.scrollTop,
			// Get the current mouse position
			x: e.clientX,
			y: e.clientY
		};
		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);
	};
	const mouseMoveHandler = function (e: MouseEvent) {
		// How far the mouse has been moved
		const dx = e.clientX - pos.x;
		const dy = e.clientY - pos.y;

		// Scroll the element
		element.scrollTop = pos.top - dy;
		element.scrollLeft = pos.left - dx;
	};

	const mouseUpHandler = function () {
		document.removeEventListener('mousemove', mouseMoveHandler);
		document.removeEventListener('mouseup', mouseUpHandler);

		element.style.cursor = 'grab';
		element.style.removeProperty('user-select');
	};

	element.addEventListener('mousedown', mouseDownHandler);

	return {
		destroy() {
			element.removeEventListener('mousedown', mouseDownHandler);
		}
	};
}
