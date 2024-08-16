export function combineBaseAndSubpath(
  baseUrl: string,
  subpath: string,
  params: Record<string, string>
): string {
  // Extract the base path without the trailing segment
  const baseUrlParts = baseUrl.split('/');
  const basePath = baseUrlParts.slice(0, 3).join('/');

  // Replace parameters in the subpath
  const filledSubpath = subpath.replace(/:(\w+)/g, (_, paramName) => {
    return params.hasOwnProperty(paramName)
      ? params[paramName]
      : `:${paramName}`;
  });

  // Combine the base path and the filled subpath
  return joinUrls(basePath, filledSubpath);
}

export function joinUrls(...urls: string[]): string {
  const [url1, ...rest] = urls;
  const trimmedUrl1 = url1.replace(/\/$/, '');
  const trimmedUrls = rest.map((url) => url.replace(/^\//, ''));

  let joinedUrl = trimmedUrl1 + '/' + trimmedUrls.join('/');
  joinedUrl = joinedUrl.replace(/([^:]\/)\/+/g, '$1');

  return joinedUrl;
}

export function replacePathParam(
  path: string,
  obj: Record<string, string>
): string {
  return path.replace(/:(\w+)/g, (_, paramName) => {
    if (obj.hasOwnProperty(paramName)) {
      return obj[paramName];
    }
    return `:${paramName}`; // Keep the original param if not found in obj
  });
}
