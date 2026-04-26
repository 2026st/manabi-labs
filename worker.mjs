export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    // SPA routing fallback: when a direct page reload requests a non-file path,
    // return index.html so client-side routing can render the correct screen.
    if (response.status !== 404) {
      return response;
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
    return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
  }
};
