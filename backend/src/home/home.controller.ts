import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @Get('privacy-policy')
  async privacyPolicy() {
    const data = await this.homeService.getSetting('privacy_policy');
    return {
      status: true,
      message: 'Privacy policy fetched successfully',
      data: {
        content: data || null
      }
    };
  }

  @Get('terms-and-conditions')
  async termsAndConditions() {
    const data = await this.homeService.getSetting('terms_and_conditions');
    return {
      status: true,
      message: 'Terms and conditions fetched successfully',
      data: {
        content: data || null
      }
    };
  }

  @Get('about-us')
  async aboutUs() {
    const data = await this.homeService.getSetting('about_us');
    const title = await this.homeService.getSetting('about_title');
    return {
      status: true,
      message: 'About us fetched successfully',
      data: {
        content: data || null,
        title: title || null
      }
    };
  }

  @Get('refund-policy')
  async refundPolicy() {
    const status = await this.homeService.getSetting('refund_policy_status');
    if (status === '0') {
      return {
        status: false,
        message: 'Refund policy is not active',
        data: null
      };
    }
    const data = await this.homeService.getSetting('refund_policy');
    return {
      status: true,
      message: 'Refund policy fetched successfully',
      data: {
        content: data || null
      }
    };
  }

  @Get('shipping-policy')
  async shippingPolicy() {
    const status = await this.homeService.getSetting('shipping_policy_status');
    if (status === '0') {
      return {
        status: false,
        message: 'Shipping policy is not active',
        data: null
      };
    }
    const data = await this.homeService.getSetting('shipping_policy');
    return {
      status: true,
      message: 'Shipping policy fetched successfully',
      data: {
        content: data || null
      }
    };
  }

  @Get('cancellation-policy')
  async cancellationPolicy() {
    const status = await this.homeService.getSetting('cancellation_policy_status');
    if (status === '0') {
      return {
        status: false,
        message: 'Cancellation policy is not active',
        data: null
      };
    }
    const data = await this.homeService.getSetting('cancellation_policy');
    return {
      status: true,
      message: 'Cancellation policy fetched successfully',
      data: {
        content: data || null
      }
    };
  }
}