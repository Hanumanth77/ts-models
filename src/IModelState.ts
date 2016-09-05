import {IAsyncState} from './IAsyncState';

export interface IModelState extends IAsyncState {

    getFieldValue(fieldName:string):any;

    setFieldValue(fieldName:string, fieldValue:any):IModelState;

    isRemovingInProgress():boolean;

    /**
     * The model has been removed on the server side if and only if the method return true and the model has no the running state
     */
    isRemoved():boolean;

    /**
     * Remove the model
     */
    remove():void;

    /**
     * The consistent state has restored between the client and the server: the model still exists on the server and process has stopped
     */
    restore():void;

    /**
     * Commit all changes, except the "remove flag"
     */
    commit<TAttributes>():TAttributes;

    /**
     * Get dirty changes
     */
    getChanges<TAttributes>():TAttributes;
}
