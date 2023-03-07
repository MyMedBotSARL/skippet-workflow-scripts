function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function readUTM(utm_param){
  const utm_name = 'utm_' + utm_param
    let utm_val = getParameterByName(utm_name) || '';
  if (utm_val) {
    Cookies.set(utm_name, utm_val, { path: '/' });
  } else {
    utm_val = Cookies.get(utm_name);
  }
  return utm_val
};

function buildFormMeta(data) {
  const meta64 = btoa(JSON.stringify(data))
  $('form[data-segment]').each((i, form) => {
    const input = document.createElement('input')
    input.setAttribute("name", "meta")
    input.setAttribute("value", meta64)
    input.setAttribute('type', 'hidden')
    form.append(input)
  })
}

const data = {}

try {
  data.u_s = readUTM('source'); // utm_source
  data.u_m = readUTM('medium'); // utm_medium
  data.u_ca = readUTM('campaign'); // utm_campaign
  data.u_co = readUTM('content'); // utm_content
  data.u_t = readUTM('term'); // utm_term
} catch (e) {
  console.log('utm err', e);
}

try {
  data.p = location.pathname; // path
  data.s = location.search; // search
  data.t = document.title; // title
  data.u = location.href; // url
  data.tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // timezone
  data.l = Intl.DateTimeFormat().resolvedOptions().locale; // locale
  data.ua = navigator.userAgent; // userAgent
  data.ce = false; // corsEnabled
} catch (e) {
  console.log('Intl err', e);
}

$.getJSON("https://api.ipify.org?format=json")
.done(function(r) {
  if (r && r.ip) {
    data.i = r.ip // ip
    data.ce = true // corsEnabled
  }
  analytics.ready(() => {
    data.ai = analytics.user().anonymousId(); // anonymousId
    buildFormMeta(data)
  })
})
.fail(function() {
  buildFormMeta(data)
})
