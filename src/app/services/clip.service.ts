import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore/';
import Clip from '../models/clip.model';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<Clip>;

  constructor(private db: AngularFirestore) {
    this.clipsCollection = db.collection('clips');
  }

  createClip(data: Clip): Promise<DocumentReference<Clip>> {
    return this.clipsCollection.add(data);
  }
}
