import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class SplashPage {
  constructor(public router: Router) {
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 3000);
  }
}
