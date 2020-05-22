# Google Cloud TTS Integration

Learn how to use the Google Cloud TTS (Text to Speech) service with the Jovo Framework.

## Installation

```sh
npm install --save jovo-tts-gcloud
```

```javascript
// @language=javascript

// src/app.js

const { GCloudTts } = require('jovo-tts-gcloud');

platform.use(
	new GCloudTts({
		credentialsFile: 'path/to/credentials'
	})
);

// @language=typescript

// src/app.ts

import { GCloudTts } from 'jovo-tts-gcloud';

platform.use(
	new GCloudTts({
		credentialsFile: 'path/to/credentials'
	})
);
```

> The configuration has to be passed to the constructor of `GCloudTts`. Setting the configuration inside the `config`-file does not work.