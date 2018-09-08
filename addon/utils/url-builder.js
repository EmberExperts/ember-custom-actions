import param from 'jquery-param';

export default function(url, path, queryParams) {
  let query = param(queryParams);
  let pathUrl = url.charAt(url.length - 1) === '/' ? `${url}${path}` : `${url}/${path}`;

  return query ? `${pathUrl}?${query}` : pathUrl;
}
