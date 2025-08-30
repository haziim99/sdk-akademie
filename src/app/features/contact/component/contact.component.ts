import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    standalone: false
})
export class ContactComponent implements OnInit {
  courses = [
    { id: 1, title: 'A1 Normal' },
    { id: 2, title: 'A1 Intensified Course' },
    { id: 3, title: 'A2' },
    { id: 4, title: 'B1' },
    { id: 5, title: 'B2' },
    { id: 6, title: 'Conversation For B1-B2 Level' }
  ];

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      //Using Angular's HttpClient to send data to your backend.

      // Example with HttpClient (assuming you have set up a backend service):
      /*
      this.http.post('your-backend-endpoint', form.value)
        .subscribe(response => {
          Swal.fire({
            icon: 'success',
            title: 'Message Sent',
            text: 'Your message has been sent successfully!',
            confirmButtonColor: '#ff6600'
          }).then((result) => {
            if (result.isConfirmed) {
              form.reset();
            }
          });
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error sending your message. Please try again later.',
            confirmButtonColor: '#ff6600'
          });
        });
      */

      // Simulate successful submission for demonstration purposes:
      Swal.fire({
        icon: 'success',
        title: 'Message Sent',
        text: 'Your message has been sent successfully!',
        confirmButtonColor: '#ff6600'
      }).then((result) => {
        if (result.isConfirmed) {
          form.reset();
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill out all required fields.',
        confirmButtonColor: '#ff6600'
      });
    }
  }
}
