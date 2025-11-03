"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const module_controller_1 = require("./module.controller");
const module_service_1 = require("./module.service");
const module_schema_1 = require("./schemas/module.schema");
const store_schema_1 = require("../store/schemas/store.schema");
const item_schema_1 = require("../item/schemas/item.schema");
let ModuleModule = class ModuleModule {
};
exports.ModuleModule = ModuleModule;
exports.ModuleModule = ModuleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Module', schema: module_schema_1.ModuleSchema },
                { name: 'Store', schema: store_schema_1.StoreSchema },
                { name: 'Item', schema: item_schema_1.ItemSchema },
            ]),
        ],
        controllers: [module_controller_1.ModuleController],
        providers: [module_service_1.ModuleService],
    })
], ModuleModule);
//# sourceMappingURL=module.module.js.map