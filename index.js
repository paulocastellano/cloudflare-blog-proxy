const BLOG_URL = "blog.your-domain.com";

async function handleRequest(request) {
  const url = new URL(request.url);

  // Check if the request path is `/blog` or starts with `/blog/`
  if (url.pathname === "/blog" || url.pathname.startsWith("/blog/")) {
    return forwardRequest(request, url.pathname + url.search);
  }

  // If the request does not match `/blog` or `/blog/*`, return a 404
  return new Response("Not Found", { status: 404 });
}

async function forwardRequest(request, pathWithSearch) {
  const originUrl = `https://${BLOG_URL}${pathWithSearch}`;
  
  // Clone request and remove unnecessary headers
  const originRequest = new Request(originUrl, {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.body,
    redirect: "follow"
  });

  originRequest.headers.delete("cookie");
  originRequest.headers.delete("referer");
  originRequest.headers.delete("origin");

  return fetch(originRequest);
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
