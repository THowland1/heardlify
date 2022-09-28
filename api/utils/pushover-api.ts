import fetch from 'node-fetch';

const trySendNotification = async (message: string) => {
	try {
		await fetch('https://api.pushover.net/1/messages.json', {
			method: 'POST',
			body: JSON.stringify({
				token: process.env.PUSHOVER_APPLICATION_KEY,
				user: process.env.PUSHOVER_USER_KEY,
				message
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		// eslint-disable-next-line no-empty
	} catch {}
};

export default { trySendNotification };
