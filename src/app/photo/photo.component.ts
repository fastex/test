import { Component, inject, Input, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ImageInfo } from '../models/image-info';
import { PhotosService } from '../services/photos.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [
    MatButtonModule,
    AsyncPipe
  ],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss'
})
export class PhotoComponent {
  private photoSevice = inject(PhotosService);
  private router = inject(Router);
  photoInfo = signal<ImageInfo | undefined>(undefined);

  @Input()
  set id(photoId: string) {
    this.photoSevice.getPhotoById(photoId).subscribe(info => this.photoInfo.set(info));
  }

  removeFromFavorites(id?: string) {
    if (id) {
      this.photoSevice.removeFromFavorites(id);
      this.router.navigate(['favorites']);
    }
  }
}
