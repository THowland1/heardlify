export type IPlaylistSummary = {
	id: string;
	images: { url: string }[];
	name: string;
	description: string;
	owner: {
		display_name: string;
	};
};
export type ISearchPlaylistsResponse = {
	playlists: {
		items: IPlaylistSummary[];
		offset: number;
		total: number;
	};
};

export async function searchPlaylists(
	baseURL: string,
	query: string,
	sessionId: string,
	offset: number,
	limit: number
): Promise<ISearchPlaylistsResponse> {
	const url = new URL(`${baseURL}/.netlify/functions/search-playlists`);
	url.searchParams.append('q', query);
	url.searchParams.append('offset', String(offset));
	url.searchParams.append('limit', String(limit));
	url.searchParams.append('sid', sessionId);
	const response = await fetch(url.toString());
	const body = await response.json();
	return body;
}
