import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getDoc,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Thing, ThingInput } from '../models/thing.model';
import { Observable, firstValueFrom, from, map, of } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ThingService {
  private firestore = inject(Firestore);
  private firebaseAuth = inject(Auth);

  private thingCollection = collection(this.firestore, 'Things');

  /**
   * Adds a new thing to the collection.
   * @param thing - The thing to be added.
   * @returns An Observable that emits the result of the add operation.
   */
  addThing(thing: ThingInput) {
    return of(
      addDoc(this.thingCollection, {
        ...thing,
        created: Timestamp.now(),
        updated: Timestamp.now(),
        author: this.firebaseAuth.currentUser?.uid as string,
      })
    );
  }

  /**
   * Retrieves a list of things.
   * @returns An Observable that emits an array of Thing objects.
   */
  getThings() {
    const q = query(this.thingCollection, orderBy("created","desc") );
    return collectionData(q, {
      idField: 'id',
    }) as Observable<Thing[]>;
  }

  /**
   * Retrieves a Thing object from Firestore based on the provided ID.
   * @param id - The ID of the Thing to retrieve.
   * @returns An Observable that emits the retrieved Thing object.
   */
  getThing(id: string) {
    return from(getDoc(doc(this.firestore, 'Things', id))).pipe(
      map((snapshot) => snapshot.data() as Thing)
    );
  }


  /**
   * Retrieves a thing using a promise.
   * @param id - The ID of the thing to retrieve.
   * @returns A promise that resolves to the retrieved thing.
   */
  async getThingPromise(id: string) {
    return await firstValueFrom(docData(doc(this.firestore, 'Things', id)));
  }

  /**
   * Updates a Thing document in Firestore.
   * 
   * @param thing - The updated Thing object.
   * @param id - The ID of the Thing document to update.
   */
  updateThing(thing: ThingInput, id: string) {
    const docRef = doc(this.firestore, 'Things', id);
    updateDoc(docRef, { ...thing });
  }

  /**
   * Deletes a thing with the specified ID.
   * 
   * @param {string} id - The ID of the thing to delete.
   */
  deleteThing(id: string) {
    const docRef = doc(this.firestore, 'things', id);
    deleteDoc(docRef);
  }
}
