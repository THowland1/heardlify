export default async (request: any, context: any) => {
  const playlistId = new URL(request.url).searchParams.get('playlist-id');

  // Get the page content that will be served next
  // In this tutorial example, it will be the content from hello-template
  const response = await context.next();
  const page = await response.text();

  console.log(page);

  // Replace the content with the current location
  const updatedPage = page.replace(
    'https://files.tomhowland.com/youhavetoburntherope_1200x630.png',
    `https://picsum.photos/1200/630?playlistId=${playlistId}`
  );

  // Return the response
  return new Response(updatedPage, response);
};
