import sharp from 'sharp';
import pixelWidth from 'string-pixel-width';

function getPixelWidth(value: string, size: number): number {
	const width = pixelWidth(value, { size: size + 5, font: 'open sans' });
	return width;
}

interface IViewbox {
	minX: number;
	minY: number;
	width: number;
	height: number;
}
interface ICentredViewbox {
	centreX: number;
	centreY: number;
	width: number;
	height: number;
}

function convertCentredCoordinatesToViewBox({
	centreX,
	centreY,
	width,
	height
}: ICentredViewbox): IViewbox {
	return {
		minX: centreX - width / 2,
		minY: centreY - height / 2,
		width,
		height
	};
}

function buildRoundedRectangle(coords: ICentredViewbox, borderRadius: number, fill: string) {
	const { minX, minY, width, height } = convertCentredCoordinatesToViewBox(coords);
	return /* html */ `
    <rect x="${minX}" width="${width}" y="${minY}" height="${height}"  rx="${borderRadius}" fill="${fill}"/>
 `;
}

function buildSpotifyLogo(coords: ICentredViewbox) {
	const { minX, minY, width, height } = convertCentredCoordinatesToViewBox(coords);
	return /* html */ `
  <svg x="${minX}" width="${width}" y="${minY}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.7318 7.09254C10.153 5.56115 5.8998 5.42004 3.43794 6.16701C3.34363 6.19526 3.2446 6.20476 3.14657 6.19498C3.04853 6.18519 2.95342 6.15631 2.86671 6.11C2.78001 6.06369 2.70341 6.00087 2.64135 5.92515C2.57929 5.84943 2.53299 5.76231 2.50512 5.66881C2.44693 5.47966 2.46664 5.27542 2.55994 5.10058C2.65325 4.92573 2.8126 4.79443 3.0033 4.73527C5.82882 3.87729 10.5267 4.04313 13.4956 5.80523C13.8512 6.01655 13.968 6.4753 13.7572 6.83039C13.7078 6.91474 13.6419 6.98853 13.5634 7.04747C13.4849 7.10641 13.3953 7.14932 13.2999 7.17372C13.2045 7.19811 13.1052 7.20349 13.0076 7.18955C12.9101 7.17562 12.8163 7.14264 12.7318 7.09254ZM12.6472 9.36086C12.605 9.43048 12.549 9.49109 12.4829 9.53918C12.4167 9.58726 12.3415 9.62186 12.2618 9.64096C12.182 9.66006 12.0991 9.66328 12.0181 9.65044C11.9369 9.6376 11.8592 9.60895 11.7895 9.56616C9.6399 8.24409 6.36148 7.86157 3.81783 8.63395C3.73915 8.65747 3.65654 8.66535 3.57475 8.65715C3.49297 8.64894 3.41364 8.62482 3.34132 8.58616C3.26901 8.54749 3.20514 8.49506 3.15339 8.43188C3.10164 8.3687 3.06303 8.29601 3.0398 8.21801C2.99175 8.06033 3.00844 7.89028 3.08625 7.7447C3.16406 7.59912 3.29674 7.48974 3.45552 7.44027C6.36081 6.55822 9.97315 6.98554 12.4425 8.50355C12.7351 8.68411 12.8278 9.06796 12.6472 9.36086ZM11.6684 11.5389C11.6349 11.5947 11.5904 11.6434 11.5375 11.682C11.4847 11.7207 11.4247 11.7485 11.3609 11.7639C11.2971 11.7794 11.2308 11.7821 11.166 11.7719C11.1011 11.7618 11.0389 11.7389 10.983 11.7048C9.10386 10.5565 6.74003 10.2971 3.95506 10.9337C3.89095 10.9481 3.82461 10.9498 3.75983 10.9387C3.69506 10.9276 3.63316 10.9039 3.57767 10.8691C3.52219 10.8342 3.47423 10.7888 3.43656 10.7355C3.39889 10.6822 3.37225 10.6221 3.35818 10.5586C3.32817 10.4302 3.35079 10.2952 3.42111 10.1833C3.49142 10.0714 3.60369 9.9916 3.73334 9.96138C6.78058 9.26457 9.39453 9.56482 11.5036 10.8535C11.6166 10.9233 11.6973 11.0344 11.7281 11.1627C11.759 11.291 11.7376 11.4262 11.6684 11.5389ZM8.00002 0C3.58125 0 0 3.58171 0 8C0 12.419 3.58125 16 8.00002 16C12.4181 16 16 12.419 16 8C16 3.58171 12.4188 0 8.00002 0Z" fill="white"></path></svg>
  `;
}

function buildText(
	{ centreX, centreY }: ICentredViewbox,
	text: string,
	fontSize: number,
	approximateTextWidth: number
) {
	return /* html */ `
 <text x="${centreX - approximateTextWidth / 2}" y="${
		centreY + fontSize / 3
	}" fill="white" font-family="system-ui" dominant-baseline="auto" text-anchor="start" font-size="${fontSize}">${text}</text>
  `;
}

function limitPixelWidth(text: string, fontSize: number, maxWidth: number) {
	const ellipsis = '...';
	if (getPixelWidth(text, fontSize) <= maxWidth) {
		return text;
	}
	while (getPixelWidth(text + ellipsis, fontSize) > maxWidth) {
		text = text.slice(0, -1);
	}
	return text + ellipsis;
}
function buildSVG(text: string) {
	const svgHeight = 630;
	const svgWidth = 1200;
	const spotifyLogoHeight = 100;
	const spotifyLogoWidth = 100;
	const fontSize = 80;

	text = limitPixelWidth(text, fontSize, 1000);
	const approximateTextWidth = getPixelWidth(text, fontSize);
	const padding = 20;

	return /* html */ `
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<style>
    .small { font:  120px system-ui; fill: white; font-weight: 600; }
  </style>
<rect width="${svgWidth}" height="${svgHeight}" fill="black" />
<text x="50%" y="35%" class="small"  dominant-baseline="middle" text-anchor="middle">HEARDLES</text>
${
	text &&
	buildRoundedRectangle(
		{
			centreX: svgWidth * 0.5,
			centreY: svgHeight * 0.65,
			height: padding + spotifyLogoHeight + padding,
			width: padding + spotifyLogoWidth + padding + approximateTextWidth + padding
		},
		20,
		'#444'
	)
}
  ${
		text &&
		buildSpotifyLogo({
			centreX: svgWidth * 0.5 - (approximateTextWidth + padding) / 2,
			centreY: svgHeight * 0.65,
			height: spotifyLogoHeight,
			width: spotifyLogoWidth
		})
	}
 ${
		text &&
		buildText(
			{
				centreX: svgWidth * 0.5 + (spotifyLogoWidth + padding) / 2,
				centreY: svgHeight * 0.65,
				height: 100,
				width: 100
			},
			text,
			fontSize,
			approximateTextWidth
		)
 }
</svg>`;
}

export const generateSVGBuffer = async (text: string) => {
	const img = sharp(Buffer.from(buildSVG(text)));
	const resized = img.resize(1200, 630);
	const buffer = await resized.toBuffer();

	return buffer;
};
