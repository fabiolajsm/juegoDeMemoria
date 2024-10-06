import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  onSnapshot,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private dataRef = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) {}

  getUserByEmail(email: string): Observable<UserInterface | null> {
    return new Observable<UserInterface | null>((observer) => {
      const q = query(this.dataRef, where('correo', '==', email));
      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          let found = false;
          snap.forEach((doc) => {
            const data = doc.data() as UserInterface;
            if (data.correo === email) {
              found = true;
              observer.next(data);
            }
          });
          if (!found) {
            observer.next(null);
          }
        },
        (error) => {
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }
}
