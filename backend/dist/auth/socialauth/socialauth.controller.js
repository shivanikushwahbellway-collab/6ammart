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
exports.SocialauthController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
let SocialauthController = class SocialauthController {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async googleLogin(email, name, image) {
        if (!email) {
            throw new common_1.HttpException('Email is required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!name || name.trim() === '') {
            throw new common_1.HttpException('Name is required', common_1.HttpStatus.BAD_REQUEST);
        }
        let user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            user = new this.userModel({
                email,
                f_name: name.trim(),
                image,
                login_medium: 'google',
            });
            await user.save();
        }
        return {
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.f_name,
                image: user.image,
            },
        };
    }
};
exports.SocialauthController = SocialauthController;
__decorate([
    (0, common_1.Post)('google-login'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Body)('image')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SocialauthController.prototype, "googleLogin", null);
exports.SocialauthController = SocialauthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SocialauthController);
//# sourceMappingURL=socialauth.controller.js.map