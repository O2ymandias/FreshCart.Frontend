import { Component, input } from '@angular/core';

@Component({
  selector: 'app-notfound-resource',
  imports: [],
  templateUrl: './notfound-resource.component.html',
  styleUrl: './notfound-resource.component.scss',
})
export class NotfoundResourceComponent {
  message = input.required<string>();
}
