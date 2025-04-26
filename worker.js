export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);

      const googleMapsUrl = new URL('https://maps.googleapis.com/maps/api/js');

      for (const [key, value] of url.searchParams) {
        googleMapsUrl.searchParams.set(key, value);
      }

      googleMapsUrl.searchParams.set('key', env.GOOGLE_MAPS_API_KEY);

      return new Response(response.body, {
        headers: {
          'content-type': 'application/javascript',
        },
      });
    },
};