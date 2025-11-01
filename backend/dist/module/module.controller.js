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
exports.ModuleController = void 0;
const common_1 = require("@nestjs/common");
const module_service_1 = require("./module.service");
let ModuleController = class ModuleController {
    moduleService;
    constructor(moduleService) {
        this.moduleService = moduleService;
    }
    async index(req, queryZoneId) {
        let zoneIds = [];
        let fallbackZoneId = undefined;
        if (req.headers['zoneId']) {
            const raw = req.headers['zoneId'];
            try {
                const parsed = JSON.parse(raw);
                zoneIds = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
            }
            catch (e) {
                throw new common_1.BadRequestException({
                    status: false,
                    message: 'Invalid zoneId header format. Expected JSON array or string.',
                    data: null,
                });
            }
        }
        else if (queryZoneId) {
            fallbackZoneId = String(queryZoneId);
            zoneIds = [fallbackZoneId];
        }
        const modules = await this.moduleService.findAllForZones(zoneIds, fallbackZoneId);
        return {
            status: true,
            message: 'Modules fetched successfully',
            data: modules,
        };
    }
};
exports.ModuleController = ModuleController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('zone_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ModuleController.prototype, "index", null);
exports.ModuleController = ModuleController = __decorate([
    (0, common_1.Controller)('modules'),
    __metadata("design:paramtypes", [module_service_1.ModuleService])
], ModuleController);
//# sourceMappingURL=module.controller.js.map