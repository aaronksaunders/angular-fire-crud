import { FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
  IonModal,
  IonInput,
  IonLabel,
  IonItem,
  IonButtons,
} from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';
import { ThingService } from '../services/thing.service';
import { Observable } from 'rxjs';
import { Thing } from '../models/thing.model';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
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
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonButton,
    CommonModule,
    FormsModule,
    IonModal,
    IonInput,
    IonLabel,
    IonItem,
    IonButtons,
  ],
})
/**
 * Represents the home page component.
 * This component is responsible for displaying and managing the home page.
 */
export class HomePage implements OnInit {
  thingService: ThingService = inject(ThingService);
  displayThings$!: Observable<Thing[]>;
  @ViewChild(IonModal) modal!: IonModal;

  name!: string;
  description!: string;

  constructor(public firebaseAuth: Auth, private router: Router) {}

  /**
   * Initializes the component and performs necessary setup tasks.
   * This method is automatically called by Angular when the component is initialized.
   */
  ngOnInit() {
    console.log('Getting things...');

    // authenticate
    this.firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User is signed in', user.uid, user.email);
        // get for UI
        this.displayThings$ = this.thingService.getThings();
        console.log('displayThings$', this.displayThings$);
      }

      if (!user) {
        console.log('User is not signed in');
        const resp = await signInWithEmailAndPassword(
          this.firebaseAuth,
          'aaron@clearlyinnovative.com',
          'password123'
        );
      }
    });
  }

  /**
   * Adds a user by calling the thingService's addThing method.
   *
   * @returns An Observable that emits the response data when the user is added successfully.
   */
  handleAddThing() {
    this.thingService
      .addThing({
        name: 'Aaron',
        description: 'Aaron Saunders',
      })
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log('error', error);
        },
      });
  }

  cardClicked(id: string | undefined) {
    // Navigate to the desired route
    debugger;
    const routeTo = `/detail/${id}`;
    this.router.navigate([routeTo]);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log('confirmed', ev.detail.data);
      console.log('confirmed', this.name, this.description);
    }
  }
}
