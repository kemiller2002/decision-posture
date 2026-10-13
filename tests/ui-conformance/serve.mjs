// Dependency-free static server for the UI conformance suite.
// It mirrors the GitHub Pages behaviour this site relies on: files are served
// as-is from the repository root, a directory serves its index.html, and a
// missing path answers 404 with the site's own 404.html (as Pages does), so a
// broken link or an unstyled 404 page is observable.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.argv[2] ?? process.env.SERVE_ROOT ?? ".");
const port = Number(process.env.PORT ?? 4317);

const TYPES = Object.freeze({
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json; charset=utf-8"
});

const contentType = file => TYPES[extname(file)] ?? "application/octet-stream";

const insideRoot = target => target === root || target.startsWith(root + sep);

const resolveFile = async url => {
  const path = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const target = normalize(join(root, path));
  if (!insideRoot(target)) return null;
  const info = await stat(target).catch(() => null);
  if (info?.isDirectory()) return resolveFile(join(path, "index.html"));
  return info?.isFile() ? target : null;
};

const respond = (response, status, file, body, method) => {
  response.writeHead(status, { "content-type": contentType(file) });
  response.end(method === "HEAD" ? undefined : body);
};

createServer(async (request, response) => {
  const file = await resolveFile(request.url ?? "/");
  const body = file ? await readFile(file).catch(() => null) : null;
  if (body) return respond(response, 200, file, body, request.method);
  const notFound = join(root, "404.html");
  const fallback = await readFile(notFound).catch(() => Buffer.from("Not found"));
  return respond(response, 404, notFound, fallback, request.method);
}).listen(port, "127.0.0.1", () => console.log(`Serving ${root} at http://127.0.0.1:${port}/`));
