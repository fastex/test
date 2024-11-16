import { Routes } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { PhotoComponent } from './photo/photo.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
    { path: '', component: PhotosComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'photos/:id', component: PhotoComponent },
    { path: '**', redirectTo: '' },
];
