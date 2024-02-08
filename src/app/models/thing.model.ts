import { Timestamp } from "@angular/fire/firestore";

export interface Thing {
    name: string;
    description: string;
    author: string;
    created: Timestamp;
    updated: Timestamp;
    id?: string;
  }

  export interface ThingInput {
    name: string;
    description: string;
  }