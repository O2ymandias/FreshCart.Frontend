import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoadingBarRouterModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
