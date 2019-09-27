
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
);
const song = 'https://s3.amazonaws.com/jovo-songs/song1.mp3';

app.setHandler({
    async LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.$googleAction!.$mediaResponse!.play(song, 'title', 'subtitle');
        this.$googleAction!.showSuggestionChips(['Stop', 'Pause']);
        this.ask('How do you like my new song?');
    },
    AUDIOPLAYER: {
        'GoogleAction.Finished'() {
            this.toIntent('HelloWorldIntent');
        },
    },
});

export {app};
