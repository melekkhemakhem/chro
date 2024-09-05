import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private fireDatabase: AngularFireDatabase) {}

  getImages(): Observable<{ url: string, text: string, date: string }[]> {
    return this.fireDatabase.list('uploads').valueChanges().pipe(
      map((uploads: any[]) => uploads.map(upload => ({
        url: upload.url,
        text: upload.text,
        date: upload.date
      })))
    );
  }
}
