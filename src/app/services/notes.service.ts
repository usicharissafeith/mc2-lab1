import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs'; 
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  query, orderBy, onSnapshot, serverTimestamp, Timestamp, 
} from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { Note, NewNote } from '../models/note.model'; 
  
@Injectable({ providedIn: 'root' }) 
export class NotesService { 
  private notesRef = collection(db, 'notes'); 
  
  // READ: a live list that re-emits every time the collection changes. 
  listNotes(): Observable<Note[]> { 
    const q = query(this.notesRef, orderBy('createdAt', 'desc')); 
    return new Observable<Note[]>((subscriber) => { 
      const unsubscribe = onSnapshot( 
        q, 
        (snapshot) => { 
          const notes = snapshot.docs.map((d) => { 
            // 'estimate' gives a local time while the server timestamp is still pending 
            const data = d.data({ serverTimestamps: 'estimate' }); 
            const created = data['createdAt']; 
            return { 
              id: d.id, 
              title: data['title'] ?? '', 
              body: data['body'] ?? '', 
              done: data['done'] ?? false, 
              createdAt: created instanceof Timestamp ? created.toDate() : null, 
            } as Note; 
          }); 
          subscriber.next(notes); 
        }, 
        (error) => subscriber.error(error), 
      ); 
      return unsubscribe; // stops listening when the page unsubscribes 
    }); 
  } 
  
  // CREATE 
  addNote(note: NewNote) { 
    return addDoc(this.notesRef, { 
      title: note.title.trim(), 
      body: note.body.trim(), 
      done: false, 
      createdAt: serverTimestamp(), 
    }); 
  } 
  
  // UPDATE 
  setDone(id: string, done: boolean) { 
    return updateDoc(doc(db, 'notes', id), { done }); 
  } 
  
  // DELETE 
  deleteNote(id: string) { 
    return deleteDoc(doc(db, 'notes', id)); 
  } 
} 