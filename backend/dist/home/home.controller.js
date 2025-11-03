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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const common_1 = require("@nestjs/common");
const home_service_1 = require("./home.service");
let HomeController = class HomeController {
    homeService;
    constructor(homeService) {
        this.homeService = homeService;
    }
    async privacyPolicy() {
        const data = await this.homeService.getSetting('privacy_policy');
        return {
            status: true,
            message: 'Privacy policy fetched successfully',
            data: {
                content: data || null
            }
        };
    }
    async termsAndConditions() {
        const data = await this.homeService.getSetting('terms_and_conditions');
        return {
            status: true,
            message: 'Terms and conditions fetched successfully',
            data: {
                content: data || null
            }
        };
    }
    async aboutUs() {
        const data = await this.homeService.getSetting('about_us');
        const title = await this.homeService.getSetting('about_title');
        return {
            status: true,
            message: 'About us fetched successfully',
            data: {
                content: data || null,
                title: title || null
            }
        };
    }
    async refundPolicy() {
        const status = await this.homeService.getSetting('refund_policy_status');
        if (status === '0') {
            return {
                status: false,
                message: 'Refund policy is not active',
                data: null
            };
        }
        const data = await this.homeService.getSetting('refund_policy');
        return {
            status: true,
            message: 'Refund policy fetched successfully',
            data: {
                content: data || null
            }
        };
    }
    async shippingPolicy() {
        const status = await this.homeService.getSetting('shipping_policy_status');
        if (status === '0') {
            return {
                status: false,
                message: 'Shipping policy is not active',
                data: null
            };
        }
        const data = await this.homeService.getSetting('shipping_policy');
        return {
            status: true,
            message: 'Shipping policy fetched successfully',
            data: {
                content: data || null
            }
        };
    }
    async cancellationPolicy() {
        const status = await this.homeService.getSetting('cancellation_policy_status');
        if (status === '0') {
            return {
                status: false,
                message: 'Cancellation policy is not active',
                data: null
            };
        }
        const data = await this.homeService.getSetting('cancellation_policy');
        return {
            status: true,
            message: 'Cancellation policy fetched successfully',
            data: {
                content: data || null
            }
        };
    }
};
exports.HomeController = HomeController;
__decorate([
    (0, common_1.Get)('privacy-policy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "privacyPolicy", null);
__decorate([
    (0, common_1.Get)('terms-and-conditions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "termsAndConditions", null);
__decorate([
    (0, common_1.Get)('about-us'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "aboutUs", null);
__decorate([
    (0, common_1.Get)('refund-policy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "refundPolicy", null);
__decorate([
    (0, common_1.Get)('shipping-policy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "shippingPolicy", null);
__decorate([
    (0, common_1.Get)('cancellation-policy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "cancellationPolicy", null);
exports.HomeController = HomeController = __decorate([
    (0, common_1.Controller)('home'),
    __metadata("design:paramtypes", [home_service_1.HomeService])
], HomeController);
//# sourceMappingURL=home.controller.js.map