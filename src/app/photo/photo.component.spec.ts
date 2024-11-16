import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoComponent } from './photo.component';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ImageInfo } from '../models/image-info';
import { PhotosService } from '../services/photos.service';
import SpyObj = jasmine.SpyObj;

describe('PhotoComponent', () => {
  let component: PhotoComponent;
  let fixture: ComponentFixture<PhotoComponent>;
  let photoService: SpyObj<PhotosService>;
  let router: SpyObj<Router>;

  beforeEach(() => {
    const photoServiceSpy = jasmine.createSpyObj('PhotosService', ['getPhotoById', 'removeFromFavorites']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [MatButtonModule, AsyncPipe, PhotoComponent],
      providers: [
        { provide: PhotosService, useValue: photoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoComponent);
    component = fixture.componentInstance;
    photoService = TestBed.inject(PhotosService) as SpyObj<PhotosService>;
    router = TestBed.inject(Router) as SpyObj<Router>;
  });

  it('should fetch photo info on id input set', () => {
    const photoId = '123';
    const mockPhotoInfo: ImageInfo = {
      "id": "19",
      "author": "Paul Jarvis",
      "width": 2500,
      "height": 1667,
      "url": "https://unsplash.com/photos/P7Lh0usGcuk",
      "download_url": "https://picsum.photos/id/19/2500/1667"
    };
    photoService.getPhotoById.and.returnValue(of(mockPhotoInfo));

    component.id = photoId;

    expect(photoService.getPhotoById).toHaveBeenCalledWith(photoId);
    expect(component.photoInfo()).toEqual(mockPhotoInfo);
  });

  it('should remove photo from favorites and navigate when id is provided', () => {
    const photoId = '123';

    component.removeFromFavorites(photoId);

    expect(photoService.removeFromFavorites).toHaveBeenCalledWith(photoId);
    expect(router.navigate).toHaveBeenCalledWith(['favorites']);
  });

  it('should not attempt to remove from favorites if id is not provided', () => {
    component.removeFromFavorites(undefined);

    expect(photoService.removeFromFavorites).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
