import { Component, inject, signal } from '@angular/core';
import { PhotosService } from '../services/photos.service';
import { AsyncPipe } from '@angular/common';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [
    AsyncPipe,
    PhotoCardComponent,
    MatGridListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss'
})
export class PhotosComponent {
  private photoSevice = inject(PhotosService);
  protected readonly photos = signal<string[]>([]);
  private maxPhotosQty = 1000;
  private currenPage = 1;

  constructor() {
    this.loadPhotos(this.currenPage);
  }

  private loadPhotos(page: number) {
    const limit = 100;
    this.photoSevice.getListOfPhotoId(page, limit).subscribe(photos => {
      this.photos.update(oldPhotos => {
        return [...oldPhotos, ...photos];
      });
    });
  }

  loaded(id: string) {
    if (this.photos().length < this.maxPhotosQty && this.photos().at(-2) === id) {
      this.currenPage++;
      this.loadPhotos(this.currenPage);
    }
  }

  addToFavirites(id: string) {
    console.log('Add photo ID: ' + id + ' to Favorites');
    this.photoSevice.addToFavorites(id);
  }
}
