import { inject, Injectable } from "@angular/core";
import { ImageInfo } from "../models/image-info";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PhotosService {
    private http: HttpClient = inject(HttpClient);

    getPhotoById(id: string | number): Observable<ImageInfo | undefined> {
        const url = `https://picsum.photos/id/${id}/info`;
        return this.http.get<ImageInfo>(url);
    }

    getListOfPhotoId(page: number, limit: number): Observable<string[]> {
        const url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
        return this.http.get<ImageInfo[]>(url).pipe(
            map(infoArr => infoArr.map(info => info.id))
        );
    }

    addToFavorites(id: string): void {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            const photoIdArr = JSON.parse(storedFavorites) as string[];
            const updatedIdArr = [...new Set([...photoIdArr, id])];
            localStorage.setItem('favorites', JSON.stringify(updatedIdArr));
        } else {
            localStorage.setItem('favorites', JSON.stringify([id]));
        }
    }

    removeFromFavorites(id: string): void {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            const photoIdArr = JSON.parse(storedFavorites) as string[];
            const updatedIdArr = photoIdArr.filter(photoId => photoId !== id);
            localStorage.setItem('favorites', JSON.stringify(updatedIdArr));
        }
    }

    getFavorites(): string[] {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            return JSON.parse(storedFavorites) as string[];
        } else {
            return [];
        }
    }
}