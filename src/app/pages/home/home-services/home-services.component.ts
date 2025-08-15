import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home-services',
  imports: [TranslatePipe],
  templateUrl: './home-services.component.html',
  styleUrl: './home-services.component.scss',
})
export class HomeServicesComponent {
  services = [
    {
      title: 'Exclusive Discounts',
      icon: '/icons/discount.svg',
      description:
        'Get access to seasonal offers, flash sales, and bundle deals. Sign up and never miss out.',
    },
    {
      title: 'Customer Service',
      icon: '/icons/support.svg',
      description:
        'Got questions? Our real humans (not bots!) are here to help you 24/7 with any issues or inquiries.',
    },
    {
      title: 'Stripe Payments',
      icon: '/icons/stripe.svg',
      description:
        'Secure payments powered by Stripe. Your card details are safe, encrypted, and fast to process.',
    },
    {
      title: 'Fast Shipping',
      icon: '/icons/shipping.svg',
      description:
        'Our deliveries are fast, tracked, and efficient—because you shouldn’t wait forever for what you love.',
    },
  ];
}
