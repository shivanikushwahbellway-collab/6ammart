import { AdminService } from './admin.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private adminService;
    private configService;
    constructor(adminService: AdminService, configService: ConfigService);
    validate(payload: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/admin.schema").Admin, {}, {}> & import("./schemas/admin.schema").Admin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
export {};
