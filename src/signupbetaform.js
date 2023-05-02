var rootFormMetaData = {}
  
function _buildFormMeta(data) {
  $('form[data-segment]').each((i, form) => {
    $(form).children("input.hidden-meta-data").remove()
    const meta64 = btoa(JSON.stringify(data)).match(/.{1,32}/g)
    for (const i in meta64) {
      const input = document.createElement('input')
      input.setAttribute("name", `meta.${i}`)
      input.setAttribute("value", meta64[i])
      input.setAttribute('type', 'hidden')
      input.setAttribute('class', 'hidden-meta-data')
      form.append(input)
    }
  })
}

for (const iterator of object) {
  
}

function buildFormMeta(data) {
  rootFormMetaData = Object.assign({}, rootFormMetaData, data)
  _buildFormMeta(rootFormMetaData)
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function readUTM(utm_param){
  const utm_name = 'utm_' + utm_param
  return getParameterByName(utm_name) || '';
};

$(document).ready(function() {
  const data = {}

  try {
    data.utm_source = readUTM('source');
    data.utm_medium = readUTM('medium');
    data.utm_campaign = readUTM('campaign');
    data.utm_content = readUTM('content');
    data.utm_term = readUTM('term');

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
  } finally {
    buildFormMeta(data)
  }

  $.getJSON("https://api.ipify.org?format=json")
  .done(function(r) {
    if (r && r.ip) {
      buildFormMeta({ ip: r.ip, corsEnabled: true })
    }
  })
});