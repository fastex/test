import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { PhotosComponent } from './photos.component';
import { PhotosService } from '../services/photos.service';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

class MockPhotosService {
  getListOfPhotoId(page: number, limit: number) {
    return of(Array(limit).fill('').map((el,i) => `photo-id-${(page-1) * limit + i + 1}`));
  }
  
  addToFavorites(id: string) {
    return;
  }
}

describe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let service: PhotosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: PhotosService, useClass: MockPhotosService }],
      imports: [MatGridListModule, MatProgressSpinnerModule, PhotoCardComponent, PhotosComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PhotosService);
    fixture.detectChanges();
  });

  it('should create the PhotosComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial photos', () => {
    expect(component['photos']().length).toBe(100);
    expect(component['photos']()[0]).toBe('photo-id-1');
  });

  it('should load more photos on loaded call with correct ID', () => {
    component.loaded('photo-id-99');
    expect(component['photos']().length).toBe(200);
    expect(component['photos']()[101]).toBe('photo-id-102');
  });

  it('should not load more photos if the loaded photo ID is not second-last', () => {
    component.loaded('photo-id-50');
    expect(component['photos']().length).toBe(100);
  });

  it('should not load more photos if maxPhotosQty is reached', () => {
    component['photos'].update(oldPhotos => Array(1000).fill('photo-id-max'));
    component.loaded('photo-id-999');
    expect(component['photos']().length).toBe(1000);
  });

  it('should call addToFavorites on PhotosService when addToFavorites is invoked', () => {
    spyOn(service, 'addToFavorites');
    component.addToFavirites('photo-id-1');
    expect(service.addToFavorites).toHaveBeenCalledWith('photo-id-1');
  });

  // Edge case: When no photos are present, loaded method should not trigger loadPhotos
  it('should not trigger loadPhotos when no photos are loaded', () => {
    component['photos'].update(() => []);
    spyOn(component as any, 'loadPhotos');
    component.loaded('photo-id-nonexistent');
    expect(component['loadPhotos']).not.toHaveBeenCalled();
  });
});
