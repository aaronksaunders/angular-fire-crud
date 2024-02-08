import { Component, OnInit } from '@angular/core';
import { AsyncPipe, JsonPipe, CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  IonButtons,
  IonBackButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
} from '@ionic/angular/standalone';
import { ThingService } from '../services/thing.service';
import { Observable } from 'rxjs';
import { Thing } from '../models/thing.model';

/**
 * Represents the detail page component.
 * This component is responsible for displaying and managing the detail page.
 */

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonButton,
  ],
})
export class DetailPage implements OnInit {
  private id: string = '';
  displayThing$: Observable<Thing> | undefined;

  constructor(
    private route: ActivatedRoute,
    private thingService: ThingService
  ) {}

  ngOnInit() {
    // Accessing URL parameters
    this.route.paramMap.subscribe((params) => {
      // Get the value of a parameter named 'id'
      this.id = params.get('id') as string;
      console.log('ID:', this.id);

      this.displayThing$ = this.thingService.getThing(this.id);
      console.log('displayThing$', this.displayThing$);
    });
  }
}
