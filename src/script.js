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
  data.utm_source = readUTM('source');
  data.utm_medium = readUTM('medium');
  data.utm_campaign = readUTM('campaign');
  data.utm_content = readUTM('content');
  data.utm_term = readUTM('term');
} catch (e) {
  console.log('utm err', e);
}

try {
  data.path = location.pathname
  data.search = location.search
  data.title = document.title
  data.url = location.href
  data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  data.locale = Intl.DateTimeFormat().resolvedOptions().locale
  data.userAgent = navigator.userAgent
  data.corsEnabled = false
} catch (e) {
  console.log('Intl err', e);
}

$.getJSON("https://api.ipify.org?format=json")
.done(function(r) {
  if (r && r.ip) {
    data.ip = r.ip
    data.corsEnabled = true
  }
  analytics.ready(() => {
    data.anonymousId = analytics.user().anonymousId()
    buildFormMeta(data)
  })
})
.fail(function() {
  buildFormMeta(data)
})
