
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader,
  IonItem, IonLabel, IonInput, IonButton, IonText, IonCheckbox,
} from '@ionic/angular';
import { AppointmentsService } from '../services/appointments.service';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
  standalone: true,
  imports: [
    FormsModule, DatePipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader,
    IonItem, IonLabel, IonInput, IonButton, IonText, IonCheckbox,
  ],
})
export class AppointmentsPage {
  private appointmentsService = inject(AppointmentsService);

  fullName = '';
  appointmentDate = '';
  appointmentTime = '';
  purpose = '';
  errorMsg = signal('');

  // Live list from Firestore, exposed as a signal for the template.
  appointments = toSignal(
    this.appointmentsService.listAppointments().pipe(
      catchError((err: Error) => {
        this.errorMsg.set(err.message);
        return of([] as Appointment[]);
      }),
    ),
    { initialValue: [] as Appointment[] },
  );

  addAppointment() {
    const fullName = this.fullName.trim();
    const purpose = this.purpose.trim();

    if (
      !fullName ||
      !this.appointmentDate ||
      !this.appointmentTime ||
      !purpose
    ) return;

    this.appointmentsService
      .addAppointment({
        fullName,
        appointmentDate: new Date(this.appointmentDate + 'T00:00:00'),
        appointmentTime: this.appointmentTime,
        purpose,
      })
      .catch((err: Error) => this.errorMsg.set(err.message));

    this.fullName = '';
    this.appointmentDate = '';
    this.appointmentTime = '';
    this.purpose = '';
  }

  toggle(appointment: Appointment, completed: boolean) {
    const status = completed ? 'Completed' : 'Pending';

    this.appointmentsService.updateStatus(appointment.id, status)
      .catch((err: Error) => this.errorMsg.set(err.message));
  }

  deleteAppointment(id: string) {
    this.appointmentsService.deleteAppointment(id)
      .catch((err: Error) => this.errorMsg.set(err.message));
  }
}
