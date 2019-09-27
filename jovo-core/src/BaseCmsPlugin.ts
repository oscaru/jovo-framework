import { BaseApp } from './BaseApp';
import { Extensible } from './Extensible';
import { HandleRequest } from './Interfaces';

export class BaseCmsPlugin extends Extensible {
    /**
     * Implemented install method
     * @param {BaseApp} app
     */
    install(app: BaseApp) {
        app
            .middleware('after.platform.init')!
            .use(this.copyCmsDataToContext.bind(this));
    }

    /**
     * Copies cms data from the app object to the jovo object.
     * @param {HandleRequest} handleRequest
     * @returns {Promise<void>}
     */
    private async copyCmsDataToContext(handleRequest: HandleRequest) {
        if (handleRequest.jovo) {
            handleRequest.jovo.$cms.$jovo = handleRequest.jovo;
            Object.assign(handleRequest.jovo.$cms, handleRequest.app.$cms);
        }
    }
}
