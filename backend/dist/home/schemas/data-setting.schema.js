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
exports.DataSettingSchema = exports.DataSetting = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let DataSetting = class DataSetting {
    key;
    value;
    type;
};
exports.DataSetting = DataSetting;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], DataSetting.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DataSetting.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DataSetting.prototype, "type", void 0);
exports.DataSetting = DataSetting = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], DataSetting);
exports.DataSettingSchema = mongoose_1.SchemaFactory.createForClass(DataSetting);
//# sourceMappingURL=data-setting.schema.js.map