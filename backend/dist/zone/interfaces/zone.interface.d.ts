export interface PlainZone {
    _id: string;
    name: string;
    display_name?: string;
    coordinates: {
        type: 'Polygon';
        coordinates: number[][][];
    };
    status: boolean;
    store_wise_topic?: string;
    customer_wise_topic?: string;
    deliveryman_wise_topic?: string;
    cash_on_delivery: boolean;
    digital_payment: boolean;
    offline_payment: boolean;
    increased_delivery_fee: number;
    increased_delivery_fee_status: boolean;
    increase_delivery_charge_message?: string;
    formated_coordinates?: {
        lat: number;
        lng: number;
    }[];
}
