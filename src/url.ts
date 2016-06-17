import {
  each,
} from 'underscore';

export function constructUrl(url, query, params) {
  const query_match = /^(.*?)(\?.*)?$/.exec(url);
  return buildUrl(query_match[1], query_match[2], query, params);
}

export function encodeString(str) {
  // XXX instead of '' there was a escape variable
  // wat is dat?
  return encodeURIComponent(str).replace(/[!'()]/g, '').replace(/\*/g, "%2A");
}


export function encodeParams(params) {
  const buf = [];

  each(params, function(value, key) {
    if (buf.length)
      buf.push('&');
    buf.push(encodeString(key), '=', encodeString(value));
  });
  return buf.join('').replace(/%20/g, '+');
}


export function buildUrl(before_qmark, from_qmark, opt_query, opt_params) {
  const url_without_query = before_qmark;
  let query = from_qmark ? from_qmark.slice(1) : null;

  if (typeof opt_query === "string")
    query = String(opt_query);

  if (opt_params) {
    query = query || "";
    const prms = encodeParams(opt_params);
    if (query && prms)
      query += '&';
    query += prms;
  }

  let url = url_without_query;
  if (query !== null)
    url += ("?" + query);

  return url;
}
