import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { PhotosService } from '../services/photos.service';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let photosServiceMock: any;

  beforeEach(() => {
    photosServiceMock = {
      getFavorites: jasmine.createSpy('getFavorites').and.returnValue(['photo1.jpg', 'photo2.jpg']),
    };

    TestBed.configureTestingModule({
      imports: [
        PhotoCardComponent,
        MatGridListModule,
        MatProgressSpinnerModule,
        RouterLink,
        FavoritesComponent,
      ],
      providers: [
        { provide: PhotosService, useValue: photosServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFavorites on PhotosService and set photos signal correctly', () => {
    expect(photosServiceMock.getFavorites).toHaveBeenCalled();
    expect(component.photos()).toEqual(['photo1.jpg', 'photo2.jpg']);
  });

  it('should handle no favorites found', () => {
    photosServiceMock.getFavorites.and.returnValue([]);
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.photos()).toEqual([]);
  });

  it('should handle when PhotosService returns null', () => {
    photosServiceMock.getFavorites.and.returnValue(null);
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.photos()).toEqual([]);
  });

});
