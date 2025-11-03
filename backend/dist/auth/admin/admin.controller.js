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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const login_admin_dto_1 = require("./dto/login-admin.dto");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
let AdminController = class AdminController {
    adminService;
    jwtService;
    constructor(adminService, jwtService) {
        this.adminService = adminService;
        this.jwtService = jwtService;
    }
    async signup(dto) {
        const existing = await this.adminService.findByEmail(dto.email);
        if (existing)
            throw new common_1.BadRequestException('Email already exists');
        return this.adminService.create(dto);
    }
    async login(dto) {
        const admin = await this.adminService.findByEmail(dto.email);
        if (!admin)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await this.adminService.validatePassword(dto.password, admin.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const payload = { email: admin.email, sub: admin._id.toString() };
        return {
            access_token: this.jwtService.sign(payload),
            admin: { id: admin._id, email: admin.email, name: admin.name },
        };
    }
    getProfile(req) {
        return req.user;
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_admin_dto_1.LoginAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getProfile", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        jwt_1.JwtService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map