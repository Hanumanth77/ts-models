import {IModelState} from './IModelState';

export interface IModel extends IModelState {
    getFieldValue(fieldName:string, defaultValue?:any):any;
}
