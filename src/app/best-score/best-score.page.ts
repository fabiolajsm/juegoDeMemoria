import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem,
  IonList,
  IonLabel,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-best-score',
  templateUrl: './best-score.page.html',
  styleUrls: ['./best-score.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    CommonModule,
    IonIcon,
    IonItem,
    IonList,
  ],
})
export class BestScorePage {
  public bestScores: { name: string; score: number }[] = [];

  constructor(private router: Router) {
    addIcons({ arrowBackOutline });

    // Aquí puedes obtener los mejores registros de tu servicio o almacenamiento local
    this.loadBestScores();
  }

  loadBestScores() {
    // Simulación de datos. Reemplaza esto con tu lógica para obtener los mejores registros.
    this.bestScores = [];
  }

  back() {
    this.router.navigate(['home']);
  }
}
