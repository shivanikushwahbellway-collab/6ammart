import { HomeService } from './home.service';
export declare class HomeController {
    private homeService;
    constructor(homeService: HomeService);
    privacyPolicy(): Promise<{
        status: boolean;
        message: string;
        data: {
            content: string | null;
        };
    }>;
    termsAndConditions(): Promise<{
        status: boolean;
        message: string;
        data: {
            content: string | null;
        };
    }>;
    aboutUs(): Promise<{
        status: boolean;
        message: string;
        data: {
            content: string | null;
            title: string | null;
        };
    }>;
    refundPolicy(): Promise<{
        status: boolean;
        message: string;
        data: null;
    } | {
        status: boolean;
        message: string;
        data: {
            content: string | null;
        };
    }>;
    shippingPolicy(): Promise<{
        status: boolean;
        message: string;
        data: null;
    } | {
        status: boolean;
        message: string;
        data: {
            content: string | null;
        };
    }>;
    cancellationPolicy(): Promise<{
        status: boolean;
        message: string;
        data: null;
    } | {
        status: boolean;
        message: string;
        data: {
            content: string | null;
        };
    }>;
}
