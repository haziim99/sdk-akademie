import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SupportService, SupportTicket, SupportResponse } from '@/app/services/support.service';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  @Input() status!: 'open' | 'closed';
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
    this.loadAllTicketsForAdmin();
  }

  navigateToAdminDashboard() {
    this.router.navigate(['/admin-dashboard']);
  }

  loadAllTicketsForAdmin(): void {
    this.supportService.getAllTickets().subscribe((tickets: SupportTicket[]) => {
      this.tickets = tickets;
      this.filteredTickets = this.tickets;
    });
  }

  // Fetch user tickets from the service
  loadUserTickets(): void {
    this.supportService.getUserTickets(this.userId).subscribe((tickets: SupportTicket[]) => {
      this.tickets = tickets;
      this.filteredTickets = this.tickets; // Initialize filtered tickets
    });
  }

  filterTickets(): void {
    this.filteredTickets = this.tickets.filter((ticket) => {
      const matchesSearch = ticket.subject.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.filterStatus ? ticket.status === this.filterStatus : true;
      return matchesSearch && matchesStatus;
    });
  }


  // Select a ticket to view details
  selectTicket(ticket: SupportTicket): void {
  this.selectedTicket = ticket;
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
      author: 'Admin',
      message: this.newReply.trim(),
      date: Timestamp.now(),
    };

    this.supportService.updateTicket(this.selectedTicket.id!, {
      responses: [...this.selectedTicket.responses, reply],
      status: 'open',
    }).then(() => {
      this.selectedTicket!.responses.push(reply);
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

        // Update the status of the ticket
    updateTicketStatus(status: 'open' | 'closed'): void {
      if (this.selectedTicket) {
        this.supportService.updateTicket(this.selectedTicket.id!, {
          ...this.selectedTicket,
          status: status,
        }).catch((error: any) => {
          console.error('Error updating ticket status:', error);
        });
      }
    }

  // Add a method for users to submit new tickets
  submitTicket(subject: string, description: string): void {
    const newTicket: SupportTicket = {
      userId: this.userId,
      subject,
      description,
      status: 'open',
      responses: [],
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now(),
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

  closeTicket(): void {
    if (!this.selectedTicket) {
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'This ticket will be closed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6600',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, close it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.supportService.updateTicket(this.selectedTicket!.id!, {
          ...this.selectedTicket,
          status: 'closed',
        }).then(() => {
          this.selectedTicket!.status = 'closed';
          Swal.fire({
            icon: 'success',
            title: 'Ticket Closed',
            text: 'The ticket has been closed successfully.',
          });
        }).catch((error: any) => {
          console.error('Error closing ticket:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an issue closing the ticket. Please try again later.',
          });
        });
      }
    });
  }

  get statusColor(): string {
    return this.status === 'open' ? 'green' : 'red';
  }

  get textColor(): string {
    return 'white';
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
