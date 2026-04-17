import BaseModel from "../configuration/base-model";
import PropertyAccess from "./property-access";
import DataControl from "./data-control";

export default abstract class PropertyValue {
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