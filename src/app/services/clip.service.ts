import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore/';
import Clip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  map,
  of,
  switchMap,
  BehaviorSubject,
  combineLatest,
  lastValueFrom,
} from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService implements Resolve<Clip | null> {
  public clipsCollection: AngularFirestoreCollection<Clip>;
  pageClips: Clip[] = [];
  pendingReq = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = db.collection('clips');
  }

  createClip(data: Clip): Promise<DocumentReference<Clip>> {
    return this.clipsCollection.add(data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    const userClips = combineLatest([this.auth.user, sort$]).pipe(
      switchMap((values) => {
        const [user, sort] = values;

        if (!user) return of([]);

        const query = this.clipsCollection.ref
          .where('uid', '==', user.uid)
          .orderBy('timestamp', this.sortClips(sort));
        return query.get();
      }),
      map((snapShot) => (snapShot as QuerySnapshot<Clip>).docs)
    );

    return userClips;
  }

  private sortClips(sortDirection: string) {
    return sortDirection === '1' ? 'desc' : 'asc';
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title,
    });
  }

  async deleteClip(clip: Clip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    );

    await clipRef.delete();
    await screenshotRef.delete();
    await this.clipsCollection.doc(clip.docID).delete();
  }

  async getClips(singleReqLimit = 6) {
    if (this.pendingReq) return;

    this.pendingReq = true;
    let query = this.clipsCollection.ref
      .orderBy('timestamp', 'desc')
      .limit(singleReqLimit);

    const { length } = this.pageClips;
    if (length) {
      const lastClipId = this.pageClips[length - 1].docID;
      const lastClip$ = this.clipsCollection.doc(lastClipId).get();
      const lastClip = await lastValueFrom(lastClip$);
      query = query.startAfter(lastClip);
    }

    const snapShot = await query.get();
    snapShot.forEach((doc) => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data(),
      });
    });

    this.pendingReq = false;
  }

  resetPageClips() {
    this.pageClips = [];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipsCollection
      .doc(route.params['id'])
      .get()
      .pipe(
        map((snapshot) => {
          const data = snapshot.data();

          if (!data) {
            this.router.navigate(['/']);
            return null;
          }

          return data;
        })
      );
  }
}
