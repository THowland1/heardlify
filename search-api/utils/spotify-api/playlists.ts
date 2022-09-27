import fetch from 'node-fetch';
import { IDetailedOption } from '../option';

function isNotNull<T>(value: T | null): value is T {
	return value !== null;
}

type WithRequired<T, K extends keyof T> = T & { [P in K]: NonNullable<T[P]> };
function propertyIsNotNull<T, TPropKey extends keyof T>(propKey: TPropKey) {
	return function (value: T): value is WithRequired<T, TPropKey> {
		return value[propKey] !== null && value[propKey] !== undefined;
	};
}

async function getOne(
	playlistId: string,
	bearerToken: string
): Promise<SpotifyApi.PlaylistObjectFull> {
	const url = new URL(`https://api.spotify.com/v1/playlists/${playlistId}`);
	const headers: HeadersInit = {
		Authorization: `Bearer ${bearerToken}`
	};
	const response = await fetch(url.toString(), { headers });
	const data = (await response.json()) as SpotifyApi.PlaylistObjectFull;
	return data;
}

async function getTracksPaged(
	playlistId: string,
	bearerToken: string,
	offset: number,
	limit: number
): Promise<SpotifyApi.PlaylistTrackResponse> {
	const url = new URL(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`);
	url.searchParams.append('offset', String(offset));
	url.searchParams.append('limit', String(limit));
	const headers: HeadersInit = {
		Authorization: `Bearer ${bearerToken}`
	};

	const response = await fetch(url.toString(), { headers });
	const data = (await response.json()) as SpotifyApi.PlaylistTrackResponse;
	return data;
}

// function mapTrackToDetailedOption(
//     track: SpotifyApi.TrackObjectFull
//   ): IDetailedOption {
//     const artists = track.artists.map((a) => ({ id: a.id, name: a.name }));
//     const formattedArtists = artists.map((a) => a.name).join(', ');

//     return {
//       artists: {
//         list: artists,
//         formatted: formattedArtists,
//       },
//       formatted: `${formattedArtists} - ${track.name}`,
//       id: track.id,
//       imgSrc: track.album.images[track.album.images.length - 1].url,
//       name: track.name,
//       year: Number(track.album.release_date.split('-')[0]),
//       previewUrl: track.preview_url,
//     };
//   }

function mapTrackToDetailedOption(
	track: WithRequired<SpotifyApi.TrackObjectFull, 'preview_url'>
): IDetailedOption {
	const artists = track.artists.map((a) => ({ id: a.id, name: a.name }));
	const formattedArtists = artists.map((a) => a.name).join(', ');

	return {
		artists: {
			list: artists,
			formatted: formattedArtists
		},
		formatted: `${formattedArtists} - ${track.name}`,
		id: track.id,
		imgSrc: track.album.images[track.album.images.length - 1]?.url ?? null,
		name: track.name,
		year: Number(track.album.release_date.split('-')[0]),
		previewUrl: track.preview_url
	};
}
const MAX_SPOTIFY_API_PAGING_LIMIT = 100;

export async function getAllTracksExpensively(
	playlistId: string,
	bearerToken: string
): Promise<IDetailedOption[]> {
	const options: IDetailedOption[] = [];

	let offset = 0;
	const limit = MAX_SPOTIFY_API_PAGING_LIMIT;
	let total: number;
	do {
		const page = await getTracksPaged(playlistId, bearerToken, offset, limit);
		total = page.total;

		const pageAsOptions = page.items
			.map((i) => i.track)
			.filter(isNotNull)
			.filter(propertyIsNotNull('preview_url'))
			.filter((t) => t.type === 'track')
			.map((i) => mapTrackToDetailedOption(i));
		options.push(...pageAsOptions);
		offset += limit;
	} while (offset < total);
	return options;
}

export default {
	getOne,
	getTracksPaged,
	getAllTracksExpensively
};
