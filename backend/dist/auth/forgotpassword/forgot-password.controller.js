"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const password_utils_1 = require("../utils/password.utils");
const uuid_1 = require("uuid");
let ForgotPasswordController = class ForgotPasswordController {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async forgotPassword(phone) {
        if (!phone) {
            throw new common_1.BadRequestException('Phone number is required');
        }
        const user = await this.userModel.findOne({ phone }).exec();
        if (!user) {
            throw new common_1.HttpException('User not found with this phone number', common_1.HttpStatus.NOT_FOUND);
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.otp = otp;
        user.otp_expires_at = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();
        return {
            success: true,
            message: 'OTP sent successfully',
            otp: otp,
        };
    }
    async verifyOtp(phone, otp) {
        if (!phone || !otp) {
            throw new common_1.BadRequestException('Phone and OTP are required');
        }
        const user = await this.userModel.findOne({ phone }).exec();
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.otp !== otp) {
            throw new common_1.HttpException('Invalid OTP', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (user.otp_expires_at && user.otp_expires_at < new Date()) {
            throw new common_1.HttpException('OTP expired', common_1.HttpStatus.UNAUTHORIZED);
        }
        const resetToken = (0, uuid_1.v4)();
        user.reset_token = resetToken;
        user.reset_token_expires_at = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        return {
            success: true,
            message: 'OTP verified successfully',
            reset_token: resetToken,
        };
    }
    async resetPassword(resetToken, newPassword, confirmPassword) {
        if (!resetToken || !newPassword || !confirmPassword) {
            throw new common_1.BadRequestException('All fields are required');
        }
        if (newPassword !== confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        if (newPassword.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters');
        }
        const user = await this.userModel.findOne({
            reset_token: resetToken,
            reset_token_expires_at: { $gt: new Date() },
        }).exec();
        if (!user) {
            throw new common_1.HttpException('Invalid or expired reset token', common_1.HttpStatus.UNAUTHORIZED);
        }
        user.password = await (0, password_utils_1.hashPassword)(newPassword);
        user.otp = undefined;
        user.otp_expires_at = undefined;
        user.reset_token = undefined;
        user.reset_token_expires_at = undefined;
        await user.save();
        return {
            success: true,
            message: 'Password reset successfully',
        };
    }
};
exports.ForgotPasswordController = ForgotPasswordController;
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForgotPasswordController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)('phone')),
    __param(1, (0, common_1.Body)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ForgotPasswordController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)('reset_token')),
    __param(1, (0, common_1.Body)('new_password')),
    __param(2, (0, common_1.Body)('confirm_password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ForgotPasswordController.prototype, "resetPassword", null);
exports.ForgotPasswordController = ForgotPasswordController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ForgotPasswordController);
//# sourceMappingURL=forgot-password.controller.js.map