import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'imageupload';
  text: string = ''; // Property to store the text input
  @ViewChild('fileinpute') input!: ElementRef;
  @ViewChild('start') start!: ElementRef;
  uploadPercent: Observable<number | undefined> | undefined; // Observable for upload progress

  constructor(
    private fireStorage: AngularFireStorage,
    private db: AngularFireDatabase
    // private firestore: AngularFirestore // Uncomment if using Firestore
  ) {}

  onchange() {
    console.log("here");
    const log = this.input.nativeElement;
    log.style.display = "block";
    const sta = this.start.nativeElement;
    sta.style.display = "none";
  }

  onTextChange(event: any) {
    this.text = event.target.value; // Update the text property with the input value
  }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const path = `yt/${file.name}`;
      const fileRef = this.fireStorage.ref(path);
      const uploadTask = this.fireStorage.upload(path, file);

      // Track upload progress
      this.uploadPercent = uploadTask.percentageChanges();

      uploadTask.snapshotChanges().pipe(
        finalize(async () => {
          const url = await fileRef.getDownloadURL().toPromise();
          console.log(url); // Log the URL

          // Save the text, URL, and date to the database
          await this.saveData(url, this.text, new Date());
        })
      ).subscribe();
    }
  }

  async saveData(url: string, text: string, date: Date) {
    const data = { url, text, date: date.toISOString() }; // Convert date to ISO string

    // If using Realtime Database
    await this.db.list('uploads').push(data);

    // If using Firestore
    // await this.firestore.collection('uploads').add(data);
  }
}
