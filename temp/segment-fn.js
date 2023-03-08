// Learn more about source functions API at
// https://segment.com/docs/connections/sources/source-functions

/**
 * Handle incoming HTTP request
 *
 * @param  {FunctionRequest} request
 * @param  {FunctionSettings} settings
 */

const privns = uuidv5.uuidv5('null', 'skippet.com', true);

function uuidv4() {
	return;
}

async function onRequest(request, settings) {
	const body = request.json(); // <{ name: string; data: object; }>
	const data = body.data; // <{ ua: string; tz: string; properties: object; path: string; campaign?: object; }>
	const type = body.name; // <'Join Beta' | undefined>
	if (!type) throw new InvalidEventPayload('type is missing from body');
	if (typeof type !== 'string')
		throw new InvalidEventPayload('type must be a string');
	if (!data) throw new InvalidEventPayload('data is missing from body');
	if (typeof data !== 'object')
		throw new InvalidEventPayload('data must be an object');

	const meta = JSON.parse(atob(data.meta));
	try {
		const payload = { ...data, ...meta };
		payload.anonymousId = meta.anonymousId || uuidv5.uuidv5(privns, new Date());
		if (type === 'Join Beta') return signupBeta(payload, body);
	} catch (e) {
		throw new RetryError(e.message);
	}
	throw new EventNotSupported(`${type} is not supported`);
}

/**
 * Handle incoming HTTP request
 *
 * @param  {payload} <{
 *  properties?: object
 *  campaign?: object
 *  ua: string
 *  tz: string
 * }>
 */
async function signupBeta(payload, body) {
	const email = payload.email;
	if (!email) throw 'email is missing from data';
	const anonymousId = payload.anonymousId;

	const context = {
		ip: payload.ip,
		campaign: {
			medium: payload.utm_medium,
			name: payload.utm_campaign,
			source: payload.utm_source
		},
		locale: payload.locale,
		page: {
			path: payload.path,
			search: payload.search,
			title: payload.title,
			url: payload.url
		},
		userAgent: payload.userAgent
	};

	await Segment.identify({
		anonymousId,
		context,
		traits: {
			email
		}
	});

	await Segment.track({
		anonymousId,
		event: 'Join Beta',
		context,
		properties: {
			webflowSiteId: body.site,
			webflowRecordId: body._id,
			corsEnabled: payload.corsEnabled,
			email
		}
	});
}

/** References:
 *
 * See https://segment.com/docs/connections/spec/track/
 * Segment.track({...});
 *
 * See https://segment.com/docs/connections/spec/identify/
 * Segment.identify({...});
 *
 * See https://segment.com/docs/connections/spec/group/
 * Segment.group({...});
 *
 * See https://segment.com/docs/connections/spec/page/
 * Segment.page({...});
 *
 * See https://segment.com/docs/connections/spec/screen/
 * Segment.screen({...});
 *
 * See https://segment.com/docs/connections/sources/catalog/libraries/server/object-api/
 * Segment.set({...});
 */
