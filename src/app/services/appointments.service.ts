
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, onSnapshot, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Appointment, NewAppointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private appointmentsRef = collection(db, 'appointments');

  // READ: a live list that re-emits every time the collection changes.
  listAppointments(): Observable<Appointment[]> {
    const q = query(this.appointmentsRef, orderBy('createdAt', 'desc'));
    return new Observable<Appointment[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const appointments = snapshot.docs.map((d) => {
            // 'estimate' gives a local time while the server timestamp is still pending
            const data = d.data({ serverTimestamps: 'estimate' });
            const created = data['createdAt'];
            const appointmentDate = data['appointmentDate'];

            return {
              id: d.id,
              fullName: data['fullName'] ?? '',
              appointmentDate: appointmentDate instanceof Timestamp
                ? appointmentDate.toDate()
                : null,
              appointmentTime: data['appointmentTime'] ?? '',
              purpose: data['purpose'] ?? '',
              status: data['status'] ?? 'Pending',
              createdAt: created instanceof Timestamp ? created.toDate() : null,
            } as Appointment;
          });
          subscriber.next(appointments);
        },
        (error) => subscriber.error(error),
      );
      return unsubscribe; // stops listening when the page unsubscribes
    });
  }

  // CREATE
  addAppointment(appointment: NewAppointment) {
    return addDoc(this.appointmentsRef, {
      fullName: appointment.fullName.trim(),
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime.trim(),
      purpose: appointment.purpose.trim(),
      status: 'Pending',
      createdAt: serverTimestamp(),
    });
  }

  // UPDATE
  updateStatus(id: string, status: string) {
    return updateDoc(doc(db, 'appointments', id), { status });
  }

  // DELETE
  deleteAppointment(id: string) {
    return deleteDoc(doc(db, 'appointments', id));
  }
}
