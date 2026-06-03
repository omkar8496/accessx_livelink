/** @type {import('next').NextConfig} */
function normalizeBasePath(raw) {
  if (!raw) return "";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.replace(/\/$/, "");
}

// Default to root for standalone exports.
// Set NEXT_PUBLIC_LIVELINK_BASE_PATH="/livelink" when serving under a subpath.
const normalizedBasePath = normalizeBasePath(
  process.env.NEXT_PUBLIC_LIVELINK_BASE_PATH ?? ""
);

const config = {
  // reactCompiler: true,
  output: "export",
  trailingSlash: true,
  // Allow running standalone (root) or under a subpath via env
  basePath: normalizedBasePath || undefined,
  assetPrefix: normalizedBasePath || undefined,
  images: {
    unoptimized: true
  },
  
};

export default config;
