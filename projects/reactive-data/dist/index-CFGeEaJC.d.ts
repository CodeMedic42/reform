declare class Data {
    #private;
    private constructor();
    static build(configuration: Configuration, value: any): Promise<Data>;
    getPropertyAt(path: string[] | string): Property;
    onChange(cb: (property: Property) => void): () => void;
    onChangedAt(path: string | string[], cb: (property: Property) => void): () => void;
    onStateChange(listener: Function): () => void;
    isValid(): boolean;
    validate(): Promise<void>;
}

declare enum State {
    idle = "idle",
    updating = "updating",
    validating = "validating"
}

declare class DataControl {
    #private;
    constructor(configuration: Configuration, initial: any);
    initialize(): Promise<void>;
    finalize(data: Data): Promise<void>;
    getInterface(): Data;
    onChange(cb: (propertyAccess: PropertyAccess) => void): () => void;
    onChangedAt(path: string | string[], cb: (propertyAccess: PropertyAccess) => void): () => void;
    changed(propertyAccess: PropertyAccess): void;
    changedAt(propertyAccess: PropertyAccess): void;
    getPropertyAccessAt(path: string[]): PropertyAccess;
    onStateChange(listener: Function): () => void;
    stateChangedAt(propertyAccess: PropertyAccess, previousPropertyState: State): void;
    onInternalChangeEnd(listener: Function): () => void;
    isValid(): boolean;
    validate(): Promise<void>;
}

declare class TriggersModel {
    #private;
    constructor(triggers?: TriggersDefinition);
    triggerOnInitialize(): boolean;
    triggerOnChange(): boolean;
    merge(triggersDef: TriggersDefinition | undefined): TriggersModel;
}

declare class ModelRule {
    #private;
    constructor(rule: RuleDefinition, triggersModel: TriggersModel);
    getRequires(): string[][];
    getAttribute(requiredValues: any[]): any;
    getEnabled(requiredValues: any[], attribute: any): any;
    hasAttribute(): boolean;
    runValidator(property: Property, attribute: any): string | null;
    getTriggers(): TriggersModel;
}

declare class ModelRules {
    #private;
    constructor(modelRules: RulesDefinition | undefined, triggersModel: TriggersModel);
    getRules(): {
        [key: string]: ModelRule;
    };
}

declare class ModelMeta {
    #private;
    constructor(meta?: {
        [key: string]: any;
    });
    get(id: string): any;
}

type BuildOptions = {
    initial: any;
    dataControl: DataControl;
    path: string[];
};
declare abstract class BaseModel {
    #private;
    constructor(modelDef: ModelDefinition, triggersModel: TriggersModel);
    getType(): string;
    getMeta(): ModelMeta;
    getRules(): ModelRules;
    getTriggers(): TriggersModel;
    abstract build(options: BuildOptions): PropertyAccess;
}

declare abstract class PropertyValue {
    abstract getValue(): any;
    abstract getPropertyAccessAt(segments: string[]): PropertyAccess | undefined;
    abstract getModel(): BaseModel;
    abstract getDataControl(): DataControl;
    abstract getPath(): string[];
    abstract setValue(newValue: any, rootChange: boolean): boolean;
    abstract insertValue(value: any, keydex: any, rootChange: boolean): boolean;
    abstract removeValue(keydex: any, rootChange: boolean): boolean;
    abstract moveValue(fromKeydex: number | string, toKeydex: number | string, rootChange: boolean): boolean;
    abstract dispose(): void;
    abstract getLength(): number;
    abstract forEach(cb: (item: any, key: any) => boolean | undefined | void): void;
    abstract map<T>(cb: (item: any, key: any) => T): T[];
    abstract isEqual(comparator: any): boolean;
    abstract initialize(): Promise<void>;
    abstract validate(): Promise<void>;
}

interface RuleStatus {
    attribute: any;
    enabled: boolean;
    message: string | null;
}

type PropertyOptions$1 = {
    value: PropertyValue;
};
interface RulesStatus {
    [key: string]: RuleStatus;
}
declare class PropertyAccess {
    #private;
    constructor(options: PropertyOptions$1);
    onStateChange(listener: Function): () => void;
    initialize(): Promise<void>;
    validate(): Promise<void>;
    getUuid(): string;
    onChange(cb: Function): () => void;
    getInterface(): Property;
    getModel(): BaseModel;
    getDataControl(): DataControl;
    getPath(): string[];
    getValue(): any;
    setValue(newValue: any, rootChange: boolean): boolean;
    insertValue(value: any, keydex: any, rootChange: boolean): boolean;
    removeValue(keydex: any, rootChange: boolean): boolean;
    moveValue(fromKeydex: number | string, toKeydex: number | string, rootChange: boolean): boolean;
    getPropertyAccessAt(path: string[]): PropertyAccess;
    getLength(): number;
    forEach(cb: (item: any, key: any) => boolean | undefined | void): void;
    map<T>(cb: (item: any, key: any) => T): T[];
    isEqual(comparator: any): boolean;
    getRulesStatus(): RulesStatus;
    getState(): State;
    isValid(): boolean;
    dispose(): void;
}

type PropertyOptions = {
    value: PropertyValue;
};
declare class Property {
    #private;
    constructor(propertyAccess: PropertyAccess);
    getUuid(): string;
    getModel(): BaseModel;
    getData(): Data;
    getPath(): string[];
    getValue(): any;
    setValue(newValue: any): boolean;
    insertValue(value: any, keydex: any): boolean;
    removeValue(keydex: any): boolean;
    moveValue(fromKeydex: number | string, toKeydex: number | string): boolean;
    getPropertyAt(path: string | string[]): Property;
    getLength(): number;
    forEach(cb: (item: any, keydex: any) => boolean | undefined | void): void;
    map<T>(cb: (item: any, keydex: any) => T): T[];
    isEqual(comparator: any): boolean;
    onChange(cb: Function): () => void;
    onStateChange(listener: Function): () => void;
    getState(): State;
    getRulesStatus(): RulesStatus;
    isValid(): boolean;
    dispose(): void;
    validate(): Promise<void>;
}

type TriggersDefinition = {
    initialize?: boolean;
    change?: boolean;
};
type MetaDefinition = {
    [key: string]: any;
};
type RuleDefinition = {
    requires?: string[];
    attribute?: any;
    enabled?: any;
    triggers?: TriggersDefinition;
    validator?(property: Property, attributeValue: any): string | null;
};
type RulesDefinition = {
    [key: string]: RuleDefinition;
};
type ModelDefinition = {
    type: string;
    meta?: MetaDefinition;
    keys?: {
        [key: string]: ModelDefinition;
    };
    items?: ModelDefinition;
    rules?: RulesDefinition;
    triggers?: TriggersDefinition;
};
type ConfigurationDefinition = {
    triggers?: TriggersDefinition;
    model: ModelDefinition;
};

declare class Configuration {
    #private;
    constructor(configuration: ConfigurationDefinition);
    getModel(): BaseModel;
    getTriggers(): TriggersModel;
}

export { Configuration as C, Data as D, Property as P, State as S };
export type { RuleDefinition as R, TriggersDefinition as T, PropertyOptions as a, RuleStatus as b, RulesStatus as c };
