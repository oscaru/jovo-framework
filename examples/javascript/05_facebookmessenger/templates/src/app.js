'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const {
	FacebookMessenger,
	ButtonType,
	PostbackButton,
	MediaType,
	stringifyFacebookDate
} = require('jovo-platform-facebookmessenger');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { DialogflowNlu } = require('jovo-nlu-dialogflow');

const app = new App();

const messenger = new FacebookMessenger({
	pageAccessToken: process.env.FB_MESSENGER_PAGE_ACCESS_TOKEN
});

messenger.use(
	new DialogflowNlu({
		credentialsFile: '../credentials.json'
	})
);

app.use(messenger, new JovoDebugger(), new FileDb());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');

		if (this.$messengerBot) {
			this.$messengerBot.showGenericTemplate({
				elements: [
					{
						title: 'Title',
						subtitle: 'Subtitle',
						image_url: 'https://via.placeholder.com/100',
						default_action: {
							type: ButtonType.Link,
							url: 'https://example.com'
						},
						buttons: [
							new PostbackButton('Action 1'),
							new PostbackButton('Action 2')
						]
					}
				]
			});

			// this.$messengerBot.showButtonTemplate({
			// 	text: 'Example',
			// 	buttons: [new PostbackButton('Action 1'), new PostbackButton('Action 2')]
			// });

			// this.$messengerBot.showMediaTemplate({
			// 	elements: [
			// 		{
			// 			media_type: MediaType.Image,
			// 			url: 'https://www.facebook.com/<username>/photos/<num-id>',
			// 			buttons: [new PostbackButton('Action')]
			// 		}
			// 	]
			// });

			// this.$messengerBot.showReceiptTemplate({
			// 	recipient_name: 'Some Name',
			// 	order_number: 'uniqueOrderId',
			// 	currency: 'EUR',
			// 	payment_method: 'Visa',
			// 	summary: {
			// 		total_cost: 14.99
			// 	}
			// });

			// this.$messengerBot.showAirlineTemplate({
			// 	intro_message: 'Some Message',
			// 	locale: 'en_US',
			// 	boarding_pass: [
			// 		{
			// 			passenger_name: 'Some Name',
			// 			pnr_number: 'uniquePassengerId',
			// 			logo_image_url: 'https://via.placeholder.com/100',
			// 			flight_info: {
			// 				flight_number: '1A',
			// 				departure_airport: {
			// 					terminal: 'B',
			// 					gate: '24',
			// 					airport_code: 'TXL',
			// 					city: 'Berlin'
			// 				},
			// 				arrival_airport: {
			// 					airport_code: 'RNG',
			// 					city: 'SomeCity'
			// 				},
			// 				flight_schedule: {
			// 					departure_time: stringifyFacebookDate(new Date())
			// 				}
			// 			}
			// 		}
			// 	]
			// });
		}
	},

	MyNameIsIntent() {
		console.log(this.$request.getInputs());

		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	}
});

module.exports.app = app;
