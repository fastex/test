import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss'
})
export class PhotoCardComponent {
  id = input.required<string>();
  loaded = output<string>();

  ngOnInit() {
    if (this.id) {
      this.loaded.emit(this.id());
    }
  }
}
