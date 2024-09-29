import { ChangeDetectionStrategy, Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Optional: for modal dialogs
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HeaderComponent implements OnInit {
  isSidebarOpen: boolean = false; // تأكد من أن هذه المتغير مُعرفة هنا
  currentLang = 'en';  // Default language
  dropdownOpen = false;
  menuOpen = false; // Track menu visibility
  userProfileImage: string = 'assets/images/default-profile.jpg'; // Default profile image
  user: User | null = null;
  profilePictureUrl: string | null = null;
  isLoggedIn: boolean = false; // Define isLoggedIn property
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    public authService: AuthService,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private modalService: NgbModal // Optional: for modal dialogs
  ) { }

  ngOnInit(): void {
    // التحقق من وجود مستخدم مسجل الدخول في التخزين
    const storedUser = this.authService.getCurrentUser();
    if (storedUser) {
      this.isLoggedIn = true;
      this.profilePictureUrl = storedUser.profilePicture || 'assets/images/default-profile.jpg';
    } else {
      this.isLoggedIn = false;
      this.profilePictureUrl = 'assets/images/default-profile.jpg';
    }

    // الاشتراك في تغيير بيانات المستخدم
    this.subscriptions.add(
      this.authService.currentUser.subscribe(user => {
        if (user) {
          this.isLoggedIn = true;
          this.profilePictureUrl = `${user.profilePicture}?t=${new Date().getTime()}` || 'assets/images/default-profile.jpg';
        } else {
          this.isLoggedIn = false;
          this.profilePictureUrl = 'assets/images/default-profile.jpg';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // إلغاء جميع الاشتراكات عند تدمير المكون
  }

  async loadUserProfile(): Promise<void> {
    // تحميل بيانات المستخدم من AuthService أو من قاعدة البيانات
    const userData = this.authService.getCurrentUser();

    if (userData) {
      this.user = userData;
      this.profilePictureUrl = userData.profilePicture || '';
      this.isLoggedIn = true; // تعيين isLoggedIn إلى true عندما تتوفر بيانات المستخدم

      console.log('User data loaded:', userData);
      console.log('Profile picture URL:', this.profilePictureUrl);
    } else {
      this.isLoggedIn = false; // تعيين isLoggedIn إلى false إذا لم تتوفر بيانات المستخدم

      console.log('No user data found.');
      console.log('Default profile picture URL:', this.profilePictureUrl);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isLoggedIn = false; // تعيين isLoggedIn إلى false عند تسجيل الخروج
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log('Sidebar toggled:', this.isSidebarOpen); // هذا سيساعدك في التأكد من أن الدالة تعمل
  }

  navigateAndCloseSidebar(route: string) {
    this.isSidebarOpen = false; // إخفاء السايد بار
    this.router.navigate([route]); // الانتقال إلى الصفحة المطلوبة
}


  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    this.dropdownOpen = false;
  }

  toggleLanguageDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToProfile(): void {
    if (this.isLoggedIn) {
      this.authService.isAdmin().subscribe((isAdmin: boolean) => {
        const targetRoute = isAdmin ? '/admin-dashboard' : '/profile';
        console.log('Navigating to:', targetRoute);
        this.router.navigate([targetRoute]);
      });
    } else {
      console.log('User is not logged in. Redirecting to login page.');
      this.router.navigate(['/login']);
    }
    this.closeSidebar();
  }

  openMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  updateProfilePicture(newProfilePictureUrl: string): void {
    console.log('Updating profile picture to:', newProfilePictureUrl);
    this.authService.updateProfilePicture(newProfilePictureUrl).subscribe({
      next: () => {
        this.profilePictureUrl = newProfilePictureUrl; // Update profile picture URL
        this.userProfileImage = newProfilePictureUrl; // Update local image
        console.log('Profile picture updated successfully.');
      },
      error: (err: any) => {
        console.error('Error updating profile picture:', err);
      }
    });
  }

  deleteProfilePic(): void {
    // Reset profile picture to default and update in backend
    console.log('Deleting profile picture. Resetting to default.');
    this.userProfileImage = 'assets/images/default-profile.jpg';
    this.profilePictureUrl = 'assets/images/default-profile.jpg';

    if (this.user) {
      this.updateProfilePicture('assets/images/default-profile.jpg');
    }
  }
}
