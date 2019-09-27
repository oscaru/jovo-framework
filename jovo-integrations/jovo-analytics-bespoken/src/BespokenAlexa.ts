import * as https from 'https';
import { Analytics, BaseApp, HandleRequest, Log, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');
import * as uuid from 'uuid';

export interface Config extends PluginConfig {
	key: string;
}

export class BespokenAlexa implements Analytics {
	config: Config = {
		key: ''
	};

	constructor(config?: Config) {
		if (config) {
			this.config = _merge(this.config, config);
		}
		this.track = this.track.bind(this);
	}

	install(app: BaseApp) {
		app.on('response', this.track);
	}

	uninstall(app: BaseApp) {
		app.removeListener('response', this.track);
	}

	track(handleRequest: HandleRequest) {
		if (!handleRequest.jovo) {
			return;
		}

		if (handleRequest.jovo.constructor.name === 'AlexaSkill') {
			const payload = this.createBespokenLoglessObject([
				handleRequest.jovo.$request!.toJSON(),
				handleRequest.jovo.$response
			]);
			this.sendDataToLogless(JSON.stringify(payload));
		}
	}

	/**
	 * Wraps a request or response to be sent to Bespoken Logless Server
	 * @param {Object} payloads Captured request and response
	 * @return {object} The request or response ready to be send to logless
	 */
	createBespokenLoglessObject(payloads: object[]) {
		const logs = payloads.map((payload, index) => {
			// we always send two logs,  0 = request, 1 = response.
			const tag = index ? 'response' : 'request';
			return {
				log_type: 'INFO',
                payload,
                tags: [tag],
                timestamp: new Date()
			};
		});
		return {
            logs,
            source: this.config.key,
            transaction_id: uuid.v4()
		};
	}

	sendDataToLogless(data: string) {
		const options = {
			headers: {
				'Content-Type': 'application/json'
			},
            host: 'logless.bespoken.tools',
            method: 'POST',
            path: '/v1/receive'
        };

		const httpRequest = https.request(options);

		httpRequest.on('error', error => {
			Log.error('Error while logging to Bespoken Services');
			Log.error(error);
		});

		httpRequest.end(data);
	}
}
