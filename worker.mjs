export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    // SPA routing fallback: when a direct page reload requests a non-file path,
    // return index.html so client-side routing can render the correct screen.
    if (response.status !== 404) {
      return withInjectedRuntimeEnv(response, env);
    }

    const url = new URL(request.url);
    const isHtmlRequest =
      request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html");
    const looksLikeFileRequest = url.pathname.includes(".");

    if (!isHtmlRequest || looksLikeFileRequest) {
      return response;
    }

    const indexUrl = new URL("/index.html", url.origin);
    const indexResponse = await env.ASSETS.fetch(
      new Request(indexUrl.toString(), request)
    );
    return withInjectedRuntimeEnv(indexResponse, env);
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
