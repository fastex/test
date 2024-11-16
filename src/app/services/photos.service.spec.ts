
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PhotosService } from './photos.service';
import { ImageInfo } from '../models/image-info';

describe('PhotosService', () => {
  let service: PhotosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PhotosService]
    });
    service = TestBed.inject(PhotosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPhotoById()', () => {
    it('should return an ImageInfo object when called with a valid ID', () => {
      const mockImageInfo: ImageInfo = { id: '1', author: 'author', width: 500, height: 500, url: 'url', download_url: 'download_url' };

      service.getPhotoById('1').subscribe(data => {
        expect(data).toEqual(mockImageInfo);
      });

      const req = httpMock.expectOne('https://picsum.photos/id/1/info');
      expect(req.request.method).toBe('GET');
      req.flush(mockImageInfo);
    });

    it('should handle HTTP error properly', () => {
      service.getPhotoById('invalid').subscribe(
        () => fail('should fail with 404'),
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne('https://picsum.photos/id/invalid/info');
      req.flush('Invalid request parameters', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getListOfPhotoId()', () => {
    it('should return a list of photo IDs', () => {
      const mockImageInfoArray: ImageInfo[] = [{ id: '1', author: 'author', width: 500, height: 500, url: 'url', download_url: 'download_url' }];

      service.getListOfPhotoId(1, 10).subscribe(data => {
        expect(data).toEqual(['1']);
      });

      const req = httpMock.expectOne('https://picsum.photos/v2/list?page=1&limit=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockImageInfoArray);
    });

    it('should handle empty result sets', () => {
      service.getListOfPhotoId(1, 10).subscribe(data => {
        expect(data).toEqual([]);
      });

      const req = httpMock.expectOne('https://picsum.photos/v2/list?page=1&limit=10');
      req.flush([]);
    });
  });

  describe('addToFavorites()', () => {
    it('should add a photo ID to favorites', () => {
      service.addToFavorites('123');
      expect(localStorage.getItem('favorites')).toEqual(JSON.stringify(['123']));
    });

    it('should not add duplicate IDs to favorites', () => {
      localStorage.setItem('favorites', JSON.stringify(['123']));
      service.addToFavorites('123');
      expect(localStorage.getItem('favorites')).toEqual(JSON.stringify(['123']));
    });

    it('should add a new ID to existing favorites', () => {
      localStorage.setItem('favorites', JSON.stringify(['123']));
      service.addToFavorites('456');
      expect(localStorage.getItem('favorites')).toEqual(JSON.stringify(['123', '456']));
    });
  });

  describe('removeFromFavorites()', () => {
    beforeEach(() => {
      localStorage.setItem('favorites', JSON.stringify(['123', '456']));
    });

    it('should remove a photo ID from favorites', () => {
      service.removeFromFavorites('123');
      expect(localStorage.getItem('favorites')).toEqual(JSON.stringify(['456']));
    });

    it('should leave favorites unchanged if the ID is not present', () => {
      service.removeFromFavorites('789');
      expect(localStorage.getItem('favorites')).toEqual(JSON.stringify(['123', '456']));
    });
  });

  describe('getFavorites()', () => {
    it('should return an empty array if there are no favorites', () => {
      expect(service.getFavorites()).toEqual([]);
    });

    it('should return a list of favorite photo IDs', () => {
      localStorage.setItem('favorites', JSON.stringify(['123', '456']));
      expect(service.getFavorites()).toEqual(['123', '456']);
    });
  });
});
