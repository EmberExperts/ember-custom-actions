import URL from 'url';
import { isEmpty } from '@ember/utils';

export default function(url, path, queryParams) {
  let urlObj = new URL(url, window.location.origin);
  if (path && !isEmpty(path)) {
    urlObj.pathname = urlObj.pathname.endsWith('/')
      ? `${urlObj.pathname}${path}`
      : `${urlObj.pathname}/${path}`;
  }
  if (queryParams) {
    Object.keys(queryParams).forEach(key =>
      urlObj.searchParams.set(key, queryParams[key])
    );
  }
  return `${urlObj.pathname}${urlObj.search}`;
}
