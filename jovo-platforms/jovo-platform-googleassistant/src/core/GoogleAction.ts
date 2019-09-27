import {BaseApp, Jovo, SpeechBuilder, Host, HandleRequest} from "jovo-core";
import _get = require('lodash.get');
const _sample = require('lodash.sample');

import {GoogleActionUser} from "./GoogleActionUser";
import {GoogleActionSpeechBuilder} from "./GoogleActionSpeechBuilder";
import { EnumGoogleAssistantRequestType } from "./google-assistant-enums";

type reprompt = string | SpeechBuilder;

export class GoogleAction extends Jovo {
    $user: GoogleActionUser;
    // $originalRequest?: T;
    // $originalResponse?: U;

    // platformRequest: T;

    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
        super(app, host, handleRequest);
        this.$googleAction = this;
        // this.platformRequest = platformRequest;
        this.$speech = new GoogleActionSpeechBuilder(this);
        this.$reprompt = new GoogleActionSpeechBuilder(this);
        this.$user = new GoogleActionUser(this);

    }


    /**
     * Returns locale of the request
     * @deprecated use this.$request.getLocale() instead
     * @return {string}
     */
    getLocale(): string {
        return this.$request!.getLocale();
    }

    /**
     * Returns timestamp of a user's request
     * @return {string | undefined}
     */
    getTimestamp() {
        return this.$request!.getTimestamp();
    }

    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder(): GoogleActionSpeechBuilder {
        return this.getSpeechBuilder();
    }


    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder(): GoogleActionSpeechBuilder {
        return new GoogleActionSpeechBuilder(this);
    }


    /**
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    isNewSession(): boolean {
        return this.$request!.isNewSession();
    }


    /**
     * Says speech and waits for answer from user.
     * Reprompt when user input fails.
     * Keeps session open.
     * @public
     * @param {string|SpeechBuilder} speech
     * @param {string|SpeechBuilder|Array<SpeechBuilder>|Array<string>} reprompt
     * @param {reprompt[]} reprompts additional reprompts
     */
    ask(speech: string | SpeechBuilder | string[], reprompt: string | SpeechBuilder | string[], ...reprompts: reprompt[]) {
        delete this.$output.tell;

        if (Array.isArray(speech)) {
            speech = _sample(speech);
        }

        if (Array.isArray(reprompt)) {
            reprompt = _sample(reprompt);
        }

        if (!reprompt) {
            reprompt = speech;
        }

        this.$output.ask = {
            speech: speech.toString(),
            reprompt: reprompt.toString()
        };

        if (reprompts) {
            this.$output.ask.reprompt = [reprompt.toString()];
            reprompts.forEach((repr: string | SpeechBuilder) => {
                (this.$output.ask!.reprompt as string[]).push(repr.toString());
            });
        }

        return this;
    }


    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasScreenInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.SCREEN_OUTPUT') !== 'undefined';
    }


    /**
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    hasAudioInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.AUDIO_OUTPUT') !== 'undefined';
    }


    /**
     * Returns media response capability of request device
     * @public
     * @return {boolean}
     */
    hasMediaResponseInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.MEDIA_RESPONSE_AUDIO') !== 'undefined';
    }

    /**
     * Returns interactive canvas capability of request device
     * @public
     * @return {boolean}
     */
    hasInteractiveCanvasInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.INTERACTIVE_CANVAS') !== 'undefined';
    }

    /**
     * Returns video capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface() {
        return false;
    }


    /**
     * Google Assistant doesn't return a device id
     * @return {string | undefined}
     */
    getDeviceId() {
        return undefined;
    }

    /**
     * Returns type of platform ("AlexaSkill","GoogleAction")
     * @public
     * @return {string}
     */
    getType() {
        return 'GoogleAction';
    }

    /**
     * Returns type of platform type
     * @public
     * @return {string}
     */
    getPlatformType() {
        return 'GoogleAssistant';
    }

    /**
     * Returns raw text of request.
     * @return {string | undefined}
     */
    getRawText() {
        return _get(this.$originalRequest || this.$request, 'inputs[0].arguments[0].rawText') ||
            _get(this.$originalRequest || this.$request, 'inputs[0].rawInputs[0].query');
    }

    isInSandbox() {
        return _get(this.$originalRequest || this.$request, 'isInSandbox', false);
    }

    /**
     * Adds additional output context objects
     * @param name
     * @param parameters
     * @param lifespanCount
     */
    addOutputContext(name: string, parameters: {[key:string]: any}, lifespanCount = 1) { // tslint:disable-line
        if (!this.$output.Dialogflow) {
            this.$output.Dialogflow = {};
        }

        if (!this.$output.Dialogflow.OutputContexts) {
            this.$output.Dialogflow.OutputContexts = [];
        }

        this.$output.Dialogflow.OutputContexts.push({
            name,
            parameters,
            lifespanCount
        });
    }

    /**
     * Returns output context for given name
     * @param name
     */
    getOutputContext(name: string) {
        return _get( this.$request, 'queryResult.outputContexts', []).find((context: any) => { // tslint:disable-line
            return context.name.indexOf(`/contexts/${name}`) > -1;
        });
    }

    /**
     * Returns true if user is not voice matched
     * @return {string}
     */
    isVoiceMatchedUser() {
        // TODO
        // return _.isNumber(parseInt(this.getUserId()));
    }

    /**
     * Returns true if the current request is of type ON_SIGN_IN
     * @public
     * @return {boolean}
     */
    isSignInRequest(): boolean {
        return this.$type.type === EnumGoogleAssistantRequestType.ON_SIGN_IN;
    }

    /**
     * Returns true if the current request is of type ON_PERMISSION
     * @public
     * @return {boolean}
     */
    isPermissionRequest(): boolean {
        return this.$type.type === EnumGoogleAssistantRequestType.ON_PERMISSION;
    }

    /**
     * Returns true if the current request is of type ON_CONFIRMATION
     * @public
     * @return {boolean}
     */
    isConfirmationRequest(): boolean {
        return this.$type.type === EnumGoogleAssistantRequestType.ON_CONFIRMATION;
    }

    /**
     * Returns true if the current request is of type ON_DATETIME
     * @public
     * @return {boolean}
     */
    isDateTimeRequest(): boolean {
        return this.$type.type === EnumGoogleAssistantRequestType.ON_DATETIME;
    }

    /**
     * Returns true if the current request is of type ON_PLACE
     * @public
     * @return {boolean}
     */
    isPlaceRequest(): boolean {
        return this.$type.type === EnumGoogleAssistantRequestType.ON_PLACE;
    }
}
