"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const banner_module_1 = require("./banner/banner.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const zone_module_1 = require("./zone/zone.module");
const auth_module_1 = require("./customer/auth.module");
const module_module_1 = require("./module/module.module");
const home_module_1 = require("./home/home.module");
const socialauth_module_1 = require("./auth/socialauth/socialauth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    uri: configService.get('ATLAS_CONNECTION'),
                }),
                inject: [config_1.ConfigService],
            }),
            banner_module_1.BannerModule,
            zone_module_1.ZoneModule,
            auth_module_1.AuthModule,
            module_module_1.ModuleModule,
            home_module_1.HomeModule,
            socialauth_module_1.SocialauthModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map