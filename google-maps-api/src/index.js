/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);

      const googleMapsUrl = new URL('https://maps.googleapis.com/maps/api/js');

      for (const [key, value] of url.searchParams) {
        googleMapsUrl.searchParams.set(key, value);
      }

      googleMapsUrl.searchParams.set('key', env.GOOGLE_MAPS_API_KEY);

	  const response = await fetch(googleMapsUrl.toString());

      return new Response(response.body, {
        headers: {
          'content-type': 'application/javascript',
        },
      });
    },
};
