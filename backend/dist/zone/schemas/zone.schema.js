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
exports.ZoneSchema = exports.Zone = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Zone = class Zone {
    name;
    display_name;
    coordinates;
    status;
    store_wise_topic;
    customer_wise_topic;
    deliveryman_wise_topic;
    cash_on_delivery;
    digital_payment;
    offline_payment;
    increased_delivery_fee;
    increased_delivery_fee_status;
    increase_delivery_charge_message;
};
exports.Zone = Zone;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Zone.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Zone.prototype, "display_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: Object,
        default: {
            type: 'Polygon',
            coordinates: [],
        },
    }),
    __metadata("design:type", Object)
], Zone.prototype, "coordinates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Zone.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Zone.prototype, "store_wise_topic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Zone.prototype, "customer_wise_topic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Zone.prototype, "deliveryman_wise_topic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Zone.prototype, "cash_on_delivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Zone.prototype, "digital_payment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Zone.prototype, "offline_payment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Zone.prototype, "increased_delivery_fee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Zone.prototype, "increased_delivery_fee_status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Zone.prototype, "increase_delivery_charge_message", void 0);
exports.Zone = Zone = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'zones' })
], Zone);
exports.ZoneSchema = mongoose_1.SchemaFactory.createForClass(Zone);
exports.ZoneSchema.index({ coordinates: '2dsphere' });
//# sourceMappingURL=zone.schema.js.map