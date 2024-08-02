export function joinUrls(url1: string, url2: string): string {
  // Trim trailing slash from url1 and leading slash from url2
  const trimmedUrl1 = url1.replace(/\/$/, '');
  const trimmedUrl2 = url2.replace(/^\//, '');

  // Join the URLs
  let joinedUrl = `${trimmedUrl1}/${trimmedUrl2}`;

  // Replace any double slashes, except those following the protocol
  joinedUrl = joinedUrl.replace(/([^:]\/)\/+/g, '$1');

  return joinedUrl;
}
