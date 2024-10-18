import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
  ],
})
export class HomePage {
  constructor(private auth: AuthService, private router: Router) {}

  selectLevel(level: 'facil' | 'medio' | 'dificil') {
    console.log(level, 'aca');

    localStorage.setItem('dificultad', level);
    this.router.navigate(['juego']);
  }

  handleLogout() {
    this.auth.logout();
    this.router.navigateByUrl('login');
  }

  goToBestScores() {
    this.router.navigate(['mejoresRegistros']);
  }
}
