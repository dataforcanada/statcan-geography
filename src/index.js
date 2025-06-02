export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const params = url.searchParams;

    // TODO: Add caching
    // DGUID API, returns GeoJSON from R2 bucket. Called in map.html
    if (url.pathname.startsWith("/dguid/")) {
      const dguid = params.get("dguid");
      const object = await env.BUCKET.get(`${dguid}.geojson`);
      return new Response(object.body);
    }

    // Autocomplete API, called in index.html
    if (url.pathname.startsWith("/api/")) {
      const searchParam = params.get("search");

      if (!searchParam || searchParam.length < 3) {
        return new Response("Search parameter must be at least 3 characters.", { status: 400 });
      }

      const cache = caches.default;
      const cacheKey = new Request(url.toString(), request);
      let response = await cache.match(cacheKey);
      if (response) {
        return response;
      }

      const searchTerm = `"${searchParam}"*`;

      // Need to use a D1 session to use read replica
      const session = env.DB.withSession()
      const stmt = await session
        .prepare(`
          SELECT geographies.dguid, fts.search_name, geographies.geographic_level
          FROM geographies_fts AS fts,
               geographies
          WHERE fts.search_name MATCH ?
          AND fts.id = geographies.id
          ORDER BY fts.rank, geographies.geographic_level DESC
          `).bind(searchTerm);
      const returnValue = await stmt.raw();
      response = new Response(JSON.stringify(returnValue), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=604800"
        }
      });
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // Serve static assets in /dist folder
    if (url.pathname = "/") {
      return env.ASSETS.fetch(request);
    }
  }
};
