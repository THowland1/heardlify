interface IResult {
	playlistId: string;
	playlistName: string;
	date: Date;
	numberOfGuesses: number | null;
	sid: string;
}
export async function recordResult(baseURL: string, result: IResult): Promise<boolean> {
	const response = await fetch(`${baseURL}/.netlify/functions/record-result`, {
		method: 'POST',
		headers: {
			// 'Content-Type': 'application/json'
		},
		body: JSON.stringify(result)
	});
	const success = response.status >= 200 && response.status < 300;
	return success;
}
