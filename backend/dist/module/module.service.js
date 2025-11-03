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
exports.ModuleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const module_schema_1 = require("./schemas/module.schema");
let ModuleService = class ModuleService {
    moduleModel;
    storeModel;
    itemModel;
    constructor(moduleModel, storeModel, itemModel) {
        this.moduleModel = moduleModel;
        this.storeModel = storeModel;
        this.itemModel = itemModel;
    }
    async findAllForZones(zoneIds, fallbackZoneId) {
        const query = { status: true };
        if (fallbackZoneId) {
            query.module_type = { $ne: 'parcel' };
        }
        const modules = await this.moduleModel.find(query).lean().exec();
        const modulesWithCounts = await Promise.all(modules.map(async (mod) => {
            const moduleId = mod._id.toString();
            const items_count = await this.itemModel.countDocuments({ module_id: moduleId });
            let stores_count = 0;
            if (zoneIds && zoneIds.length > 0) {
                stores_count = await this.storeModel.countDocuments({
                    module_id: moduleId,
                    zone_id: { $in: zoneIds.map(id => id) },
                });
            }
            else if (fallbackZoneId) {
                stores_count = await this.storeModel.countDocuments({
                    module_id: moduleId,
                    zone_id: fallbackZoneId,
                });
            }
            else {
                stores_count = await this.storeModel.countDocuments({ module_id: moduleId });
            }
            return {
                ...mod,
                items_count,
                stores_count,
            };
        }));
        return modulesWithCounts;
    }
};
exports.ModuleService = ModuleService;
exports.ModuleService = ModuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(module_schema_1.Module.name)),
    __param(1, (0, mongoose_1.InjectModel)('Store')),
    __param(2, (0, mongoose_1.InjectModel)('Item')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ModuleService);
//# sourceMappingURL=module.service.js.map