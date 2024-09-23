import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SupportService, SupportTicket, SupportResponse } from '@/app/services/support.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  tickets: SupportTicket[] = [];
  filteredTickets: SupportTicket[] = [];
  selectedTicket: SupportTicket | null = null;
  searchTerm: string = '';
  filterStatus: string = '';
  newReply: string = '';
  userId: string = 'currentUserId'; // Replace with the actual user ID logic


  constructor(
    private supportService: SupportService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.loadUserTickets();
  }

  // Fetch user tickets from the service
  loadUserTickets(): void {
    this.supportService.getUserTickets(this.userId).subscribe((tickets: SupportTicket[]) => {
      this.tickets = tickets;
      this.filteredTickets = this.tickets; // Initialize filtered tickets
    });
  }

  // Select a ticket to view details
  selectTicket(ticket: SupportTicket): void {
    this.selectedTicket = ticket;
  }

  // Filter tickets based on search term and status
  filterTickets(): void {
    this.filteredTickets = this.tickets.filter((ticket) => {
      const matchesSearch = ticket.subject
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.filterStatus
        ? ticket.status === this.filterStatus
        : true;
      return matchesSearch && matchesStatus;
    });
  }

  // Send a reply to the selected ticket
  sendReply(): void {
    if (!this.selectedTicket || !this.newReply.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please enter a valid reply.',
        confirmButtonColor: '#ff6600',
      });
      return;
    }

    const reply: SupportResponse = {
      author: 'Admin', // This can be replaced with the actual user’s name or role
      message: this.newReply.trim(),
      date: new Date(),
    };

    // Update ticket with the new reply
    this.supportService.updateTicket(this.selectedTicket.id!, {
      responses: [...this.selectedTicket.responses, reply],
      status: 'open', // Optionally change status based on logic
    }).then(() => {
      this.newReply = '';
      Swal.fire({
        icon: 'success',
        title: 'Reply Sent',
        text: 'Your reply has been sent successfully.',
        confirmButtonColor: '#ff6600',
      });
    }).catch((error: any) => {
      console.error('Error sending reply:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue sending your reply. Please try again later.',
      });
    });
  }

  // Add a method for users to submit new tickets
  submitTicket(subject: string, description: string): void {
    const newTicket: SupportTicket = {
      userId: this.userId,
      subject,
      description,
      status: 'open',
      responses: [],
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    this.supportService.submitTicket(newTicket).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Ticket Submitted',
        text: 'Your ticket has been submitted successfully.',
      });
      this.loadUserTickets(); // Refresh the ticket list
    }).catch((error: any) => {
      console.error('Error submitting ticket:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an issue submitting your ticket. Please try again later.',
      });
    });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']); // تأكد من أن هذا هو مسار لوحة التحكم الخاص بك
  }
}
