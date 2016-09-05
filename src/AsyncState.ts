import {IAsyncState} from './IAsyncState';

export class AsyncState implements IAsyncState {

    protected running:boolean = false;

    /**
     * @override
     */
    public isRunning():boolean {
        return this.running;
    }

    /**
     * @override
     */
    public start() {
        this.running = true;
    }

    /**
     * @override
     */
    public stop() {
        this.running = false;
    }
}
