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
exports.ZoneService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ZoneService = class ZoneService {
    zoneModel;
    constructor(zoneModel) {
        this.zoneModel = zoneModel;
    }
    async getZones() {
        const zones = await this.zoneModel.find({ status: true }).lean().exec();
        return zones.map((zone) => {
            const coords = zone.coordinates?.coordinates?.[0] || [];
            const formatted = coords.map(([lng, lat]) => ({ lat, lng }));
            return {
                ...zone,
                formated_coordinates: formatted,
            };
        });
    }
    async zonesCheck(lat, lng, zoneId) {
        if (!lat || !lng || !zoneId) {
            throw new common_1.BadRequestException('lat, lng, and zone_id are required');
        }
        const exists = await this.zoneModel.exists({
            _id: zoneId,
            status: true,
            coordinates: {
                $geoIntersects: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat],
                    },
                },
            },
        });
        return !!exists;
    }
};
exports.ZoneService = ZoneService;
exports.ZoneService = ZoneService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Zone')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ZoneService);
//# sourceMappingURL=zone.service.js.map