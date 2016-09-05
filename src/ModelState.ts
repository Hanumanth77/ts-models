import {clone} from './Utils';

import {IModelState} from './IModelState';
import {AsyncState} from './AsyncState';

export class ModelState<TAttributes extends {[index:string]:any;}> extends AsyncState implements IModelState {

    private removed:boolean = false;

    private pendingValues:TAttributes = {} as TAttributes;
    private values:TAttributes = {} as TAttributes;

    /**
     * @override
     */
    public setFieldValue(fieldName:string, fieldValue:any):IModelState {
        if (this.isRunning()) {
            this.pendingValues[fieldName] = fieldValue;
        } else {
            this.values[fieldName] = fieldValue;
        }
        return this;
    }

    /**
     * @override
     */
    public getFieldValue(fieldName:string):any {
        const pendingValue:any = this.pendingValues[fieldName];
        if (typeof pendingValue === "undefined") {
            return this.values[fieldName];
        }
        return pendingValue;
    }

    /**
     * @override
     */
    public isRemovingInProgress():boolean {
        return this.removed && this.isRunning();
    }

    /**
     * The model has been removed on the server side if and only if the method return true and the model has no the running state
     *
     * @override
     */
    public isRemoved():boolean {
        return this.removed && !this.isRunning();
    }

    /**
     * @override
     */
    public remove() {
        /**
         * Now we have the consistent state between the client and the server: the model not exists on the client,
         * but still exists on the server and process has started
         */
        this.start();
        this.removed = true;
    }

    /**
     * The consistent state has restored between the client and the server: the model still exists on the server and process has stopped
     *
     * @override
     */
    public restore() {
        this.removed = false;
        this.stop();
    }

    /**
     * @override
     */
    public commit():TAttributes {
        const savedValues:TAttributes = clone(this.values);

        this.values = {} as TAttributes;

        /**
         * Apply the pending values to the state
         */
        Object.keys(this.pendingValues).forEach((pendingValueName:string) => {
            this.values[pendingValueName] = this.pendingValues[pendingValueName];
        });
        this.pendingValues = {} as TAttributes;

        return savedValues;
    }

    /**
     * @override
     */
    public getChanges():TAttributes {
        return this.values;
    }
}
