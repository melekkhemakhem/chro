import { Component } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { AngularFireStorage } from "@angular/fire/compat/storage"
import { AngularFirestore } from '@angular/fire/compat/firestore'; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'imageupload';
  text: string = ''; // Property to store the text input

  constructor(
    private fireStorage: AngularFireStorage,
    private db: AngularFireDatabase // If using Realtime Database
    // private firestore: AngularFirestore // Uncomment if using Firestore
  ) {}

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const path = `yt/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      
      console.log(url); // Log the URL

      // Save the text and URL to the database
      await this.saveData(url, this.text);
    }
  }

  async saveData(url: string, text: string) {
    // If using Realtime Database
    await this.db.list('uploads').push({ url, text });

    // If using Firestore
    // await this.firestore.collection('uploads').add({ url, text });
  }
}
