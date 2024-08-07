export function joinUrls(...urls: string[]): string {
  // Trim trailing slash from url1 and leading slash from url2
  const [url1, ...rest] = urls;
  const trimmedUrl1 = url1.replace(/\/$/, '');
  const trimmedUrls = rest.map((url) => url.replace(/^\//, ''));

  // Join the URLs
  let joinedUrl = trimmedUrl1 + '/' + trimmedUrls.join('/');

  // Replace any double slashes, except those following the protocol
  joinedUrl = joinedUrl.replace(/([^:]\/)\/+/g, '$1');

  return joinedUrl;
}

export function replacePathParam(
  path: string,
  obj: Record<string, string>
): string {
  const regex = /:(\w+)/;
  const match = path.match(regex);

  if (match && match[1]) {
    const paramName = match[1];
    if (obj.hasOwnProperty(paramName)) {
      return path.replace(`:${paramName}`, obj[paramName]);
    }
  }

  return path;
}
