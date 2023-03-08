const metaMap = {
  u_s: "utm_source",
  u_m: "utm_medium",
  u_ca: "utm_campaign",
  u_co: "utm_content",
  u_t: "utm_term",
  p: "path",
  s: "search",
  t: "title",
  u: "url",
  tz: "timezone",
  l: "locale",
  ua: "userAgent",
  ce: "corsEnabled",
  i: "ip",
  ai: "anonymousId"
}

function extractMeta(meta, map, encode = 'base64') {
  let metadata = {}
  if (encode === 'base64') {
    metadata = JSON.parse(atob(meta));
  }
  return _.keys(map).reduce((data, k) => {
    data[map[k]] = metadata[k]
  }, {})
}