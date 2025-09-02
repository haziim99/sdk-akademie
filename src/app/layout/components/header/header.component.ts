import { ChangeDetectionStrategy, Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { User } from '@/app/core/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class HeaderComponent implements OnInit {
  isSidebarOpen: boolean = false;
  currentLang = 'en';
  dropdownOpen = false;
  menuOpen = false;
  userProfileImage: string = 'assets/images/default-profile.jpg';
  user: User | null = null;
  profilePictureUrl: string | null = null;
  isLoggedIn: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    public authService: AuthService,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private modalService: NgbModal
  ) {}

  /**
   * Initialize component state
   */
  ngOnInit(): void {
    const storedUser = this.authService.getCurrentUser();

    if (storedUser) {
      this.isLoggedIn = true;
      this.profilePictureUrl = storedUser.profilePicture || 'assets/images/default-profile.jpg';
    } else {
      this.isLoggedIn = false;
      this.profilePictureUrl = 'assets/images/default-profile.jpg';
    }

    // Listen for user changes
    this.subscriptions.add(
      this.authService.currentUser.subscribe(user => {
        if (user) {
          this.isLoggedIn = true;
          this.profilePictureUrl = user.profilePicture || 'assets/images/default-profile.jpg';
        } else {
          this.isLoggedIn = false;
          this.profilePictureUrl = 'assets/images/default-profile.jpg';
        }
      })
    );
  }

  /**
   * Cleanup subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Load user profile data
   */
  async loadUserProfile(): Promise<void> {
    const userData = this.authService.getCurrentUser();

    if (userData) {
      this.user = userData;
      this.profilePictureUrl = userData.profilePicture || '';
      this.isLoggedIn = true;

      console.log('User data loaded:', userData);
    } else {
      this.isLoggedIn = false;
      console.log('No user data found.');
    }
  }

  /**
   * Handle user logout
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
  }

  /**
   * Sidebar control
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log('Sidebar toggled:', this.isSidebarOpen);
  }

  navigateAndCloseSidebar(route: string): void {
    this.isSidebarOpen = false;
    this.router.navigate([route]);
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  /**
   * Language switching
   */
  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    this.dropdownOpen = false;
  }

  toggleLanguageDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Navigation to user profile or admin dashboard
   */
  goToProfile(): void {
    if (this.isLoggedIn) {
      this.authService.isAdmin().subscribe((isAdmin: boolean) => {
<<<<<<< HEAD
        const targetRoute = isAdmin ? '/admin' : '/user';
=======
        const targetRoute = isAdmin ? '/admin' : '/user/profile';
>>>>>>> optimized-architecture
        this.router.navigate([targetRoute]);
      });
    } else {
      this.router.navigate(['/login']);
    }
    this.closeSidebar();
  }

  /*** Menu control */
  openMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Update user profile picture
   */
  updateProfilePicture(newProfilePictureUrl: string): void {
    this.authService.updateProfilePicture(newProfilePictureUrl).subscribe({
      next: () => {
        this.profilePictureUrl = newProfilePictureUrl;
        this.userProfileImage = newProfilePictureUrl;
        console.log('Profile picture updated successfully.');
      },
      error: (err: any) => {
        console.error('Error updating profile picture:', err);
      }
    });
  }

  /**
   * Delete profile picture (reset to default)
   */
  deleteProfilePic(): void {
    this.userProfileImage = 'assets/images/default-profile.jpg';
    this.profilePictureUrl = 'assets/images/default-profile.jpg';

    if (this.user) {
      this.updateProfilePicture('assets/images/default-profile.jpg');
    }
  }
}
