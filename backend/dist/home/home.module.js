"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const home_controller_1 = require("./home.controller");
const home_service_1 = require("./home.service");
const data_setting_schema_1 = require("./schemas/data-setting.schema");
let HomeModule = class HomeModule {
};
exports.HomeModule = HomeModule;
exports.HomeModule = HomeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'data_settings', schema: data_setting_schema_1.DataSettingSchema },
            ]),
        ],
        controllers: [home_controller_1.HomeController],
        providers: [home_service_1.HomeService],
    })
], HomeModule);
//# sourceMappingURL=home.module.js.map