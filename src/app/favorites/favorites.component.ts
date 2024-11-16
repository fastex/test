import { Component, inject, signal } from '@angular/core';
import { PhotosService } from '../services/photos.service';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    PhotoCardComponent,
    MatGridListModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  private photoSevice = inject(PhotosService);
  photos = signal<string[]>(this.photoSevice.getFavorites() ?? []);
}
