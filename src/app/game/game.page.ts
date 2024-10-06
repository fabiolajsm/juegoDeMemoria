import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  AlertController,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { Subscription, interval } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class GamePage implements OnInit, OnDestroy {
  public images: { [key: string]: string[] } = {
    facil: ['assets/animal1.png', 'assets/animal2.png', 'assets/animal3.png'],
    medio: [
      'assets/herramienta1.png',
      'assets/herramienta2.png',
      'assets/herramienta3.png',
      'assets/herramienta4.png',
      'assets/herramienta5.png',
    ],
    dificil: [
      'assets/fruta1.png',
      'assets/fruta2.png',
      'assets/fruta3.png',
      'assets/fruta4.png',
      'assets/fruta5.png',
      'assets/fruta6.png',
      'assets/fruta7.png',
      'assets/fruta8.png',
    ],
  };

  public arrayRespuesta: string[] = [];
  public pregunta: string = 'assets/preguntaFacil.png';
  public arrayGame: string[] = [];
  public active: boolean = true;
  private timerId: any;

  public selected: string[] = [];
  public selectedIndex: number[] = [];
  public seconds: number = 0;
  private subscription!: Subscription;
  public gameStarted: boolean = false;
  public score: number = 0; // Contador de aciertos
  public dificultad: string = localStorage.getItem('dificultad') ?? 'facil';

  constructor(
    private gameService: GameService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ arrowBackOutline });
    this.dificultad = localStorage.getItem('dificultad') ?? 'facil';
    switch (this.dificultad) {
      case 'facil':
        this.pregunta = 'assets/preguntaFacil.png';
        break;
      case 'medio':
        this.pregunta = 'assets/preguntaMedio.png';
        break;
      case 'dificil':
        this.pregunta = 'assets/preguntaDificil.png';
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.initializeGame();
  }

  initializeGame() {
    // Seleccionar las imágenes según la dificultad
    const selectedImages = this.images[this.dificultad];
    this.arrayRespuesta = [...selectedImages, ...selectedImages]; // Duplicar imágenes para pares
    this.arrayGame = Array(this.arrayRespuesta.length).fill(this.pregunta); // Inicializar el juego con la imagen de pregunta
    this.shuffleArray(this.arrayRespuesta);
    this.score = 0; // Reiniciar el contador de aciertos
  }

  shuffleArray(array: string[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  startGame() {
    this.gameStarted = true;
    this.seconds = 0;
    this.active = false; // Desactivar selección inicialmente

    this.subscription = interval(1000).subscribe(() => {
      this.seconds++;
      if (this.seconds >= 30) {
        this.endGame();
      }
    });

    // Mostrar imágenes por 3 segundos
    this.arrayGame = [...this.arrayRespuesta]; // Mostrar todas las imágenes
    setTimeout(() => {
      this.arrayGame.fill(this.pregunta); // Ocultar imágenes
      this.active = true; // Activar selección
    }, 3000);
  }

  async selectPic(index: number) {
    if (this.active && !this.selectedIndex.includes(index)) {
      this.selected.push(this.arrayRespuesta[index]);
      this.selectedIndex.push(index);
      this.arrayGame[index] = this.arrayRespuesta[index];

      if (this.selected.length === 2) {
        this.active = false; // Desactiva selección

        if (this.selected[0] === this.selected[1]) {
          // Coincidencia
          this.score++; // Aumentar el contador de aciertos
          this.selectedIndex = [];
          this.selected = [];
          this.active = true;

          // Mostrar alerta de acierto
          const alert = await this.alertController.create({
            message: '¡Acertaste!',
            buttons: ['Aceptar'],
          });
          await alert.present();

          // Verificar si ganó
          if (!this.arrayGame.includes(this.pregunta)) {
            const winAlert = await this.alertController.create({
              message: '¡¡¡ GANASTE !!!',
              buttons: [
                {
                  text: 'Aceptar',
                  handler: () => {
                    this.saveGame(true); // Guardar el juego como ganado
                    this.gameStarted = false; // Desactivar el juego
                  },
                },
              ],
            });
            await winAlert.present();
          }
        } else {
          // No coinciden, ocultar imágenes y mostrar alerta de fallo
          this.active = false;
          const alert = await this.alertController.create({
            message: 'Fallaste, intenta de nuevo',
            buttons: ['Aceptar'],
          });
          await alert.present();

          this.timerId = setTimeout(() => {
            this.arrayGame[this.selectedIndex[0]] = this.pregunta;
            this.arrayGame[this.selectedIndex[1]] = this.pregunta;
            this.selectedIndex = [];
            this.selected = [];
            this.active = true;
          }, 2000);
        }
      }
    }
  }

  saveGame(won: boolean) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.gameService.saveGame(this.seconds, this.dificultad, won, this.score);
      this.seconds = 0;
    }
  }

  async endGame() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const alert = await this.alertController.create({
      message: 'Se acabó el tiempo, perdiste',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.saveGame(false); // Guardar juego como perdido
            this.gameStarted = false; // Desactivar el juego
          },
        },
      ],
    });
    await alert.present();
  }

  reset() {
    this.initializeGame();
    this.active = true;
    this.seconds = 0;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  back() {
    this.router.navigate(['home']);
  }
}
