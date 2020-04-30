import URL from 'url';

export default function(url, path, queryParams) {
  let pathUrl;
  if (path) {
    let maybeMissingSlash = url.endsWith('/') || path.startsWith('/') ? '' : '/'
    pathUrl = `${url}${maybeMissingSlash}${path}`;
  } else {
    pathUrl = url
  }

  // Use native URL API to generate query
  let queryObj = new URL('https://exelord.com/ember-custom-actions/').searchParams;
  if (queryParams) {
    Object.keys(queryParams).forEach(key =>
      queryObj.set(key, queryParams[key])
    );
  }
  let query = queryObj.toString();

  return query ? `${pathUrl}?${query}` : pathUrl;
}
