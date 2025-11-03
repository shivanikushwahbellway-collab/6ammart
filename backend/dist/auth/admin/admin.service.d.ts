import { Model } from 'mongoose';
import { AdminDocument } from './schemas/admin.schema';
export declare class AdminService {
    private adminModel;
    constructor(adminModel: Model<AdminDocument>);
    create(createAdminDto: any): Promise<AdminDocument>;
    findByEmail(email: string): Promise<AdminDocument | null>;
    findById(id: string): Promise<AdminDocument | null>;
    validatePassword(plain: string, hashed: string): Promise<boolean>;
}
