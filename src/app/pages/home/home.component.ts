import { Component } from '@angular/core';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { HomeTrendingProductsComponent } from './home-trending-products/home-trending-products.component';
import { HomeCategoriesComponent } from './home-categories/home-categories.component';
import { HomeServicesComponent } from './home-services/home-services.component';

@Component({
  selector: 'app-home',
  imports: [
    HomeHeaderComponent,
    HomeTrendingProductsComponent,
    HomeCategoriesComponent,
    HomeServicesComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
