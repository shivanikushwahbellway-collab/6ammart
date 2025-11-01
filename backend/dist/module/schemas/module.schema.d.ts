import { Document } from 'mongoose';
export type ModuleDocument = Module & Document;
export declare class Module {
    module_name: string;
    module_type: string;
    thumbnail?: string;
    status: boolean;
    stores_count: number;
    icon?: string;
    theme_id: number;
    description?: string;
    all_zone_service: boolean;
}
export declare const ModuleSchema: import("mongoose").Schema<Module, import("mongoose").Model<Module, any, any, any, Document<unknown, any, Module, any, {}> & Module & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Module, Document<unknown, {}, import("mongoose").FlatRecord<Module>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Module> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
