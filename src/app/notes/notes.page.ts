import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader,
  IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonCheckbox, IonText,
} from '@ionic/angular';
import { NotesService } from '../services/notes.service';
import { Note } from '../models/note.model';

@Component({ 
  selector: 'app-notes', 
  templateUrl: './notes.page.html', 
  styleUrls: ['./notes.page.scss'], 
  standalone: true, 
  imports: [ 
    FormsModule, DatePipe, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, 
    IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonCheckbox, IonText, 
  ], 
}) 
export class NotesPage { 
  private notesService = inject(NotesService); 
  
  title = ''; 
  body = ''; 
  errorMsg = signal(''); 
  
  // Live list from Firestore, exposed as a signal for the template. 
  notes = toSignal( 
    this.notesService.listNotes().pipe( 
      catchError((err: Error) => { 
        this.errorMsg.set(err.message); 
        return of([] as Note[]); 
      }), 
    ), 
    { initialValue: [] as Note[] }, 
  );

  add() { 
    const title = this.title.trim(); 
    if (!title) return; 
    // Not awaited on purpose: the list updates instantly (latency compensation) 
    // and the write still goes through later if the device is offline. 
    this.notesService 
      .addNote({ title, body: this.body }) 
      .catch((err: Error) => this.errorMsg.set(err.message)); 
    this.title = ''; 
    this.body = ''; 
  } 
  
  toggle(note: Note, done: boolean) { 
    this.notesService.setDone(note.id, done) 
      .catch((err: Error) => this.errorMsg.set(err.message)); 
  } 
  
  remove(note: Note) { 
    this.notesService.deleteNote(note.id) 
      .catch((err: Error) => this.errorMsg.set(err.message)); 
  } 
} 