import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Game } from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private dataRef = collection(this.firestore, 'games');

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private auth: AuthService
  ) {}

  async saveGame(seconds: number, tipo: string, won: boolean, score: number) {
    try {
      const email = await this.auth.getCurrentUserEmail();

      if (email) {
        this.userService.getUserByEmail(email).subscribe(async (user) => {
          if (user) {
            const docs = doc(this.dataRef);
            await setDoc(docs, {
              id: docs.id,
              tiempo: seconds,
              user: user.correo.split('@')[0],
              tipo: tipo,
              ganado: won, // Si ganó o no
              aciertos: score, // Número de aciertos
            });
          } else {
            console.error('User not found');
          }
        });
      } else {
        console.error('No authenticated user');
      }
    } catch (error) {
      console.error('Error saving game: ', error);
    }
  }

  traer(): Observable<Game[]> {
    return new Observable<Game[]>((observer) => {
      onSnapshot(this.dataRef, (snap) => {
        const games: Game[] = [];
        snap.docChanges().forEach((x) => {
          const one = x.doc.data() as Game;
          games.push(one);
        });
        observer.next(games);
      });
    });
  }
}
