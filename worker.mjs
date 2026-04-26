export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isHtmlNavigationRequest =
      request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html");
    const lastSegment = url.pathname.split("/").pop() ?? "";
    const assetExtPattern =
      /\.(?:js|mjs|cjs|css|map|json|txt|xml|ico|png|jpe?g|gif|webp|svg|woff2?|ttf|otf|eot|pdf|mp4|webm|mp3|wav)$/i;
    const looksLikeFileRequest = assetExtPattern.test(lastSegment);

    // Important: some asset hosts can return 30x for unknown paths. If we pass
    // that through, browser reloads on SPA routes jump to "/". For document
    // navigation requests on non-file paths, always serve index.html first.
    if (isHtmlNavigationRequest && !looksLikeFileRequest && url.pathname !== "/") {
      // Some asset setups redirect /index.html -> /. Return "/" directly
      // to avoid propagating a 307 redirect to the browser.
      const rootResponse = await env.ASSETS.fetch(
        new Request(new URL("/", url.origin).toString(), request)
      );
      return withInjectedRuntimeEnv(rootResponse, env);
    }

    const response = await env.ASSETS.fetch(request);
    return withInjectedRuntimeEnv(response, env);
  }
};

async function withInjectedRuntimeEnv(response, env) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const html = await response.text();
  const transformed = html
    .replaceAll('"__SUPABASE_URL__"', JSON.stringify(env.SUPABASE_URL ?? ""))
    .replaceAll('"__SUPABASE_KEY__"', JSON.stringify(env.SUPABASE_KEY ?? ""));

  const headers = new Headers(response.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.delete("content-length");

  return new Response(transformed, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
