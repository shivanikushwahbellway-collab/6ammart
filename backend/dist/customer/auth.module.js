"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_controller_1 = require("./auth.controller");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const user_schema_1 = require("../auth/schemas/user.schema");
const phone_verification_schema_1 = require("../auth/schemas/phone-verification.schema");
const email_verification_schema_1 = require("../auth/schemas/email-verification.schema");
const guest_schema_1 = require("../auth/schemas/guest.schema");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'sindbad-secret-key',
                signOptions: { expiresIn: '7d' },
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: phone_verification_schema_1.PhoneVerification.name, schema: phone_verification_schema_1.PhoneVerificationSchema },
                { name: email_verification_schema_1.EmailVerification.name, schema: email_verification_schema_1.EmailVerificationSchema },
                { name: guest_schema_1.Guest.name, schema: guest_schema_1.GuestSchema },
            ]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
    }),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: phone_verification_schema_1.PhoneVerification.name, schema: phone_verification_schema_1.PhoneVerificationSchema },
                { name: email_verification_schema_1.EmailVerification.name, schema: email_verification_schema_1.EmailVerificationSchema },
                { name: guest_schema_1.Guest.name, schema: guest_schema_1.GuestSchema },
            ]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map