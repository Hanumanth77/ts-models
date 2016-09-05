import {
    ILogger,
    LoggerFactory,
    IEnvironmentLogger
} from 'angular2-smart-logger';

import {IModelState} from './IModelState';
import {ModelState} from './ModelState';
import {IModel} from './IModel';
import {IModelAttributes} from './IModelAttributes';

export class Model<TAttributes> implements IModel, IModelAttributes<TAttributes> {

    private static logger:ILogger = LoggerFactory.makeLogger(Model);
    
    private state:IModelState = new ModelState();

    constructor(protected attributes:TAttributes = {} as TAttributes) {
        this.attributes = attributes;
    }

    /**
     * @override
     */
    public setFieldValue(fieldName:string, fieldValue:any):IModel {
        this.state.setFieldValue(fieldName, fieldValue);

        Model.logger.debug((logger:IEnvironmentLogger) => {
            logger.write('[$Model][setFieldValue]: The model', this, `, field: ${fieldName}, value: ${fieldValue}`);
        });
        return this;
    }

    /**
     * @override
     */
    public getFieldValue(fieldName:string, defaultValue?:any):any {
        const stateValue:any = this.state.getFieldValue(fieldName);

        if (typeof stateValue === 'undefined') {
            const attributesValue:any = this.attributes[fieldName];
            if (typeof attributesValue === 'undefined') {
                const scopeValue:any = this[fieldName];
                if (typeof scopeValue === 'undefined') {
                    return defaultValue;
                }
                return scopeValue;
            } else {
                return attributesValue;
            }
        } else {
            return stateValue;
        }
    }

    /**
     * @override
     */
    public getChanges():TAttributes {
        return this.state.getChanges<TAttributes>();
    }

    /**
     * @override
     */
    public isRemovingInProgress():boolean {
        return this.state.isRemovingInProgress();
    }

    /**
     * @override
     */
    public isRemoved():boolean {
        return this.state.isRemoved();
    }

    /**
     * @override
     */
    public isRunning():boolean {
        return this.state.isRunning();
    }

    /**
     * @override
     */
    public remove() {
        this.state.remove();
    }

    /**
     * @override
     */
    public restore() {
        this.state.restore();
    }

    /**
     * @override
     */
    public commit():TAttributes {
        const savedAttributes:TAttributes = this.state.commit<TAttributes>();
        
        /**
         * Apply saved values from state to the attributes of model.
         * The attributes - in fact, are a mirror of model state on the server
         */
        Object.assign(this.attributes, savedAttributes);
        
        return savedAttributes;
    }

    /**
     * @override
     */
    public stop() {
        this.state.stop();
    }

    /**
     * @override
     */
    public start() {
        this.state.start();
    }

    /**
     * @override
     */
    public getId():any {
        return this.getFieldValue('id', null);
    }

    /**
     * @override
     */
    public toJSON():TAttributes {
        return this.attributes;
    }
}
