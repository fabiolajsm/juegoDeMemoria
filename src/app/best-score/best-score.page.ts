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
import { GameService } from '../services/game.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-best-score',
  templateUrl: './best-score.page.html',
  styleUrls: ['./best-score.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonLabel,
    IonIcon,
    IonItem,
    IonList,
    CommonModule,
    NgxSpinnerModule,
  ],
})
export class BestScorePage implements OnInit {
  public bestScores: { name: string; score: number }[] = [];

  constructor(
    private router: Router,
    private gameService: GameService,
    public spinner: NgxSpinnerService
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit(): void {
    this.loadBestScores();
  }

  loadBestScores() {
    this.spinner.show();
    this.gameService.traer().subscribe((games) => {
      // Filtrar solo los juegos ganados y transformar a la estructura adecuada
      this.bestScores = games
        .filter((game) => game.ganado) // Solo juegos ganados
        .sort((a, b) => b.aciertos - a.aciertos) // Ordenar de mayor a menor aciertos
        .slice(0, 5) // Obtener solo los 5 mejores
        .map((game) => ({ name: game.user, score: game.aciertos })); // Transformar a la nueva estructura
      this.spinner.hide();
    });
  }

  back() {
    this.router.navigate(['home']);
  }
}
