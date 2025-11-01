"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const user_schema_1 = require("../auth/schemas/user.schema");
const phone_verification_schema_1 = require("../auth/schemas/phone-verification.schema");
const email_verification_schema_1 = require("../auth/schemas/email-verification.schema");
const guest_schema_1 = require("../auth/schemas/guest.schema");
let AuthService = class AuthService {
    userModel;
    phoneVerificationModel;
    emailVerificationModel;
    guestModel;
    jwtService;
    constructor(userModel, phoneVerificationModel, emailVerificationModel, guestModel, jwtService) {
        this.userModel = userModel;
        this.phoneVerificationModel = phoneVerificationModel;
        this.emailVerificationModel = emailVerificationModel;
        this.guestModel = guestModel;
        this.jwtService = jwtService;
    }
    generateToken(user) {
        const payload = { email: user.email, sub: user._id.toString() };
        return this.jwtService.sign(payload, { expiresIn: '7d' });
    }
    generateOtp() {
        return process.env.APP_MODE === 'test' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    }
    generateRefCode(user) {
        return (user._id.toString().substring(0, 6) + Math.random().toString(36).substring(2, 8)).toUpperCase();
    }
    async assignRefCode(user) {
        if (!user.ref_code) {
            const refCode = this.generateRefCode(user);
            await this.userModel.updateOne({ _id: user._id }, { ref_code: refCode });
        }
    }
    async mergeGuestCart(userId, guestId) {
        console.log(`Merging guest cart ${guestId} into user ${userId}`);
    }
    async register(dto) {
        try {
            const { name, email, phone, password, ref_code, guest_id } = dto;
            const [firstName, lastName = ''] = name.split(' ', 2);
            let refBy = null;
            if (ref_code) {
                const refUser = await this.userModel.findOne({ ref_code, status: true });
                if (!refUser) {
                    throw new common_1.BadRequestException('Referrer code not found');
                }
                refBy = refUser._id;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new this.userModel({
                f_name: firstName,
                l_name: lastName,
                email,
                phone,
                password: hashedPassword,
                ref_by: refBy,
            });
            await user.save();
            await this.assignRefCode(user);
            let isPhoneVerified = 1;
            let isEmailVerified = true;
            const phoneVerificationEnabled = true;
            if (phoneVerificationEnabled) {
                isPhoneVerified = 0;
                const otp = this.generateOtp();
                await this.phoneVerificationModel.updateOne({ phone }, { token: otp, otp_hit_count: 0 }, { upsert: true });
            }
            const token = isPhoneVerified && isEmailVerified ? this.generateToken(user) : null;
            return {
                status: true,
                message: 'User registered successfully ',
                data: {
                    token,
                    is_phone_verified: isPhoneVerified,
                    is_email_verified: isEmailVerified,
                    is_personal_info: 1,
                    is_exist_user: null,
                    login_type: 'manual',
                    email: user.email || null,
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Registration failed',
                data: {},
            };
        }
    }
    async login(dto) {
        try {
            const { login_type } = dto;
            if (login_type === 'manual')
                return await this.manualLogin(dto);
            if (login_type === 'otp')
                return dto.verified ? await this.otpLogin(dto) : await this.sendOtp(dto);
            if (login_type === 'social')
                return await this.socialLogin(dto);
            throw new common_1.BadRequestException('Invalid login type');
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Login failed',
                data: {},
            };
        }
    }
    async manualLogin(dto) {
        try {
            const { email_or_phone, password, field_type, guest_id } = dto;
            const query = field_type === 'email' ? { email: email_or_phone } : { phone: email_or_phone };
            const user = await this.userModel.findOne(query);
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            const isPasswordValid = await bcrypt.compare(password, user.password || '');
            if (!isPasswordValid)
                throw new common_1.UnauthorizedException('Invalid credentials');
            if (!user.status)
                throw new common_1.UnauthorizedException('Account blocked');
            await this.assignRefCode(user);
            user.login_medium = 'manual';
            await user.save();
            const token = user.f_name ? this.generateToken(user) : null;
            if (guest_id && token) {
                await this.mergeGuestCart(user._id.toString(), guest_id);
            }
            return {
                status: true,
                message: 'Login successful',
                data: {
                    token,
                    is_phone_verified: 1,
                    is_email_verified: 1,
                    is_personal_info: user.f_name ? 1 : 0,
                    is_exist_user: null,
                    login_type: 'manual',
                    email: user.email || null,
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Manual login failed',
                data: {},
            };
        }
    }
    async sendOtp(dto) {
        try {
            const { phone } = dto;
            const otpInterval = 60;
            const existing = await this.phoneVerificationModel.findOne({ phone });
            if (existing &&
                existing.updatedAt &&
                Date.now() - new Date(existing.updatedAt).getTime() < otpInterval * 1000) {
                const timeLeft = otpInterval - Math.floor((Date.now() - new Date(existing.updatedAt).getTime()) / 1000);
                throw new common_1.BadRequestException(`Please try again after ${timeLeft} seconds`);
            }
            const otp = this.generateOtp();
            await this.phoneVerificationModel.updateOne({ phone }, { token: otp, otp_hit_count: 0 }, { upsert: true });
            return {
                status: true,
                message: 'OTP sent successfully',
                data: {
                    token: null,
                    is_phone_verified: 0,
                    is_email_verified: 1,
                    is_personal_info: 1,
                    is_exist_user: null,
                    login_type: 'otp',
                    email: null,
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Failed to send OTP',
                data: {},
            };
        }
    }
    async otpLogin(dto) {
        try {
            const { phone, otp, guest_id } = dto;
            const verification = await this.phoneVerificationModel.findOne({ phone, token: otp });
            if (!verification)
                throw new common_1.BadRequestException('OTP does not match');
            let user = await this.userModel.findOne({ phone });
            if (!user) {
                const hashedPassword = await bcrypt.hash(phone, 10);
                user = new this.userModel({
                    phone,
                    password: hashedPassword,
                    is_phone_verified: true,
                    login_medium: 'otp',
                });
                await user.save();
                await this.assignRefCode(user);
            }
            else {
                if (!user.status)
                    throw new common_1.UnauthorizedException('Account blocked');
                user.is_phone_verified = true;
                user.login_medium = 'otp';
                await user.save();
                await this.assignRefCode(user);
            }
            await this.phoneVerificationModel.deleteOne({ phone, token: otp });
            const token = user.f_name ? this.generateToken(user) : null;
            if (guest_id && token) {
                await this.mergeGuestCart(user._id.toString(), guest_id);
            }
            return {
                status: true,
                message: 'OTP login successful',
                data: {
                    token,
                    is_phone_verified: 1,
                    is_email_verified: 1,
                    is_personal_info: user.f_name ? 1 : 0,
                    is_exist_user: null,
                    login_type: 'otp',
                    email: user.email || null,
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'OTP login failed',
                data: {},
            };
        }
    }
    async socialLogin(dto) {
        try {
            const { email, medium, unique_id, guest_id } = dto;
            let user = await this.userModel.findOne({ email });
            if (!user) {
                user = new this.userModel({
                    email,
                    login_medium: medium,
                    temp_token: unique_id,
                    is_email_verified: true,
                });
                await user.save();
                await this.assignRefCode(user);
            }
            else {
                if (!user.status)
                    throw new common_1.UnauthorizedException('Account blocked');
                user.login_medium = medium;
                user.is_email_verified = true;
                await user.save();
                await this.assignRefCode(user);
            }
            const token = user.f_name ? this.generateToken(user) : null;
            if (guest_id && token) {
                await this.mergeGuestCart(user._id.toString(), guest_id);
            }
            return {
                status: true,
                message: 'Social login successful',
                data: {
                    token,
                    is_phone_verified: 1,
                    is_email_verified: 1,
                    is_personal_info: user.f_name ? 1 : 0,
                    is_exist_user: null,
                    login_type: 'social',
                    email: user.email || null,
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Social login failed',
                data: {},
            };
        }
    }
    async verifyPhoneOrEmail(dto) {
        try {
            const { otp, verification_type, phone, email, login_type, guest_id } = dto;
            const user = phone
                ? await this.userModel.findOne({ phone })
                : await this.userModel.findOne({ email });
            if (login_type === 'manual' && user) {
                if ((verification_type === 'phone' && user.is_phone_verified) ||
                    (verification_type === 'email' && user.is_email_verified)) {
                    return {
                        status: true,
                        message: 'Already verified',
                        data: {},
                    };
                }
                let verification;
                if (verification_type === 'phone') {
                    verification = await this.phoneVerificationModel.findOne({ phone, token: otp });
                    if (verification) {
                        user.is_phone_verified = true;
                        await this.phoneVerificationModel.deleteOne({ phone, token: otp });
                    }
                }
                else {
                    verification = await this.emailVerificationModel.findOne({ email, token: otp });
                    if (verification) {
                        user.is_email_verified = true;
                        await this.emailVerificationModel.deleteOne({ email, token: otp });
                    }
                }
                if (verification) {
                    await user.save();
                    const token = user.f_name ? this.generateToken(user) : null;
                    if (guest_id && token) {
                        await this.mergeGuestCart(user._id.toString(), guest_id);
                    }
                    return {
                        status: true,
                        message: 'Verification successful',
                        data: {
                            token,
                            is_phone_verified: 1,
                            is_email_verified: 1,
                            is_personal_info: user.f_name ? 1 : 0,
                            is_exist_user: null,
                            login_type,
                            email: user.email || null,
                        },
                    };
                }
                else {
                    throw new common_1.BadRequestException('OTP does not match');
                }
            }
            if (login_type === 'otp') {
                const verification = await this.phoneVerificationModel.findOne({ phone, token: otp });
                if (!verification)
                    throw new common_1.BadRequestException('OTP does not match');
                if (!user) {
                    const hashedPassword = await bcrypt.hash(phone, 10);
                    const newUser = new this.userModel({
                        phone,
                        password: hashedPassword,
                        is_phone_verified: true,
                        login_medium: 'otp',
                    });
                    await newUser.save();
                    await this.assignRefCode(newUser);
                    return {
                        status: true,
                        message: 'User created and verified via OTP',
                        data: {
                            token: null,
                            is_phone_verified: 1,
                            is_email_verified: 1,
                            is_personal_info: 0,
                            is_exist_user: null,
                            login_type: 'otp',
                            email: null,
                        },
                    };
                }
                user.is_phone_verified = true;
                user.login_medium = 'otp';
                await user.save();
                await this.assignRefCode(user);
                await this.phoneVerificationModel.deleteOne({ phone, token: otp });
                const token = user.f_name ? this.generateToken(user) : null;
                if (guest_id && token) {
                    await this.mergeGuestCart(user._id.toString(), guest_id);
                }
                return {
                    status: true,
                    message: 'OTP verification successful',
                    data: {
                        token,
                        is_phone_verified: 1,
                        is_email_verified: 1,
                        is_personal_info: user.f_name ? 1 : 0,
                        is_exist_user: null,
                        login_type: 'otp',
                        email: user.email || null,
                    },
                };
            }
            throw new common_1.BadRequestException('Not found');
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Verification failed',
                data: {},
            };
        }
    }
    async firebaseAuthVerify(dto) {
        try {
            const result = await this.verifyPhoneOrEmail({ ...dto, verification_type: 'phone' });
            return result;
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Firebase verification failed',
                data: {},
            };
        }
    }
    async guestRequest(dto) {
        try {
            const guest = new this.guestModel(dto);
            await guest.save();
            return {
                status: true,
                message: 'Guest verified',
                data: {
                    guest_id: guest._id.toString(),
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Guest request failed',
                data: {},
            };
        }
    }
    async updateInfo(dto) {
        try {
            const { name, login_type, phone, email, ref_code, guest_id } = dto;
            const [firstName, lastName = ''] = name.split(' ', 2);
            let user;
            if (login_type === 'otp' || login_type === 'manual') {
                user = await this.userModel.findOne({ phone });
            }
            else {
                user = await this.userModel.findOne({ email });
            }
            if (!user)
                throw new common_1.BadRequestException('User not found');
            if (user.f_name)
                throw new common_1.BadRequestException('Already exists');
            let refBy = null;
            if (ref_code) {
                const refUser = await this.userModel.findOne({ ref_code, status: true });
                if (refUser)
                    refBy = refUser._id;
            }
            user.f_name = firstName;
            user.l_name = lastName;
            user.email = email;
            user.phone = phone;
            user.ref_by = refBy;
            await user.save();
            const token = this.generateToken(user);
            if (guest_id) {
                await this.mergeGuestCart(user._id.toString(), guest_id);
            }
            return {
                status: true,
                message: 'User info updated successfully',
                data: {
                    token,
                    is_phone_verified: 1,
                    is_email_verified: 1,
                    is_personal_info: 1,
                    is_exist_user: null,
                    login_type,
                    email: user.email || null,
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Failed to update info',
                data: {},
            };
        }
    }
    async customerLoginFromDrivemond(dto) {
        try {
            const { phone, token } = dto;
            let user = await this.userModel.findOne({ phone });
            if (!user) {
                const hashedPassword = await bcrypt.hash(phone, 10);
                user = new this.userModel({
                    f_name: 'Drivemond',
                    l_name: 'User',
                    email: `${phone}@drivemond.com`,
                    phone,
                    password: hashedPassword,
                    is_phone_verified: true,
                });
                await user.save();
                await this.assignRefCode(user);
            }
            const tokenJwt = this.generateToken(user);
            return {
                status: true,
                message: 'Drivemond login successful',
                data: {
                    token: tokenJwt,
                    is_phone_verified: user.is_phone_verified,
                },
            };
        }
        catch (error) {
            return {
                status: false,
                message: error.message || 'Drivemond login failed',
                data: {},
            };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(phone_verification_schema_1.PhoneVerification.name)),
    __param(2, (0, mongoose_1.InjectModel)(email_verification_schema_1.EmailVerification.name)),
    __param(3, (0, mongoose_1.InjectModel)(guest_schema_1.Guest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map