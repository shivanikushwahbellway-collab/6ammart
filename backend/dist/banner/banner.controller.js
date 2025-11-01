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
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const banner_service_1 = require("./banner.service");
const get_banners_dto_1 = require("./dto/get-banners.dto");
let BannerController = class BannerController {
    bannerService;
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    async getBanners(zoneIdHeader, dto, moduleId, allZoneServiceStr) {
        if (!zoneIdHeader) {
            throw new common_1.BadRequestException({
                status: false,
                message: 'Zone ID is required',
            });
        }
        let zoneIds;
        try {
            zoneIds = JSON.parse(zoneIdHeader);
        }
        catch (e) {
            throw new common_1.BadRequestException({
                status: false,
                message: 'Invalid zoneId header format. Expected JSON array.',
            });
        }
        const currentModule = moduleId
            ? {
                id: moduleId,
                all_zone_service: allZoneServiceStr === 'true',
            }
            : undefined;
        const { banners } = await this.bannerService.getBanners(zoneIds, dto.featured, currentModule);
        return {
            status: true,
            message: 'Banners fetched successfully',
            banners,
        };
    }
    async getStoreBanners(zoneIdHeader, storeId, moduleId, allZoneServiceStr) {
        if (!zoneIdHeader) {
            throw new common_1.BadRequestException({
                status: false,
                message: 'Zone ID is required',
            });
        }
        let zoneIds;
        try {
            zoneIds = JSON.parse(zoneIdHeader);
        }
        catch (e) {
            throw new common_1.BadRequestException({
                status: false,
                message: 'Invalid zoneId header format. Expected JSON array.',
            });
        }
        const currentModule = moduleId
            ? {
                id: moduleId,
                all_zone_service: allZoneServiceStr === 'true',
            }
            : undefined;
        const banners = await this.bannerService.getStoreBanners(zoneIds, storeId, currentModule);
        return {
            status: true,
            message: 'Store banners fetched successfully',
            banners,
        };
    }
};
exports.BannerController = BannerController;
__decorate([
    (0, common_1.Get)('/list'),
    __param(0, (0, common_1.Headers)('zoneId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Headers)('x-module-id')),
    __param(3, (0, common_1.Headers)('x-all-zone-service')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_banners_dto_1.GetBannersDto, String, String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getBanners", null);
__decorate([
    (0, common_1.Get)('/store/:store_id'),
    __param(0, (0, common_1.Headers)('zoneId')),
    __param(1, (0, common_1.Param)('store_id')),
    __param(2, (0, common_1.Headers)('x-module-id')),
    __param(3, (0, common_1.Headers)('x-all-zone-service')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getStoreBanners", null);
exports.BannerController = BannerController = __decorate([
    (0, common_1.Controller)('banner'),
    __metadata("design:paramtypes", [banner_service_1.BannerService])
], BannerController);
//# sourceMappingURL=banner.controller.js.map