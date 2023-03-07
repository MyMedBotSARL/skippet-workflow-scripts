// set with type="fs-cc" fs-cc-categories="marketing" attribute on script tag
function readUTM(utm_param){
  console.log('readUTM cookie')
  const utm_name = 'utm_' + utm_param;
  let utm_val = getParameterByName(utm_name) || '';
  if (utm_val) {
    Cookies.set(utm_name, utm_val, { path: '/' });
  } else {
    utm_val = Cookies.get(utm_name);
  }
  return utm_val
};

analytics.ready(() => {
  const data = {}
  try {
    data.utm_source = readUTM('source');
    data.utm_medium = readUTM('medium');
    data.utm_campaign = readUTM('campaign');
    data.utm_content = readUTM('content');
    data.utm_term = readUTM('term');
    data.anonymousId = analytics.user().anonymousId()
  } catch (e) {
    console.log('utm err', e);
  } finally {
    console.log('buildFormMeta from analytics', data)
    buildFormMeta(data)
  }
})