import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AdminController {
    private adminService;
    private jwtService;
    constructor(adminService: AdminService, jwtService: JwtService);
    signup(dto: CreateAdminDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/admin.schema").Admin, {}, {}> & import("./schemas/admin.schema").Admin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    login(dto: LoginAdminDto): Promise<{
        access_token: string;
        admin: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
        };
    }>;
    getProfile(req: any): any;
}
