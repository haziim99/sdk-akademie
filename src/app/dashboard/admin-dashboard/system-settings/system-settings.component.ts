import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@/app/services/notification.service';
import { SettingsService } from '@/app/services/settings.service';
@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit {
  academyName: string = '';
  academyEmail: string = '';
  paymentOptions: string[] = [];
  selectedPaymentOption: string = '';
  notificationEnabled: boolean = false;
  loading: boolean = false;

  constructor(private settingsService: SettingsService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadSettings();
    this.loadPaymentOptions();
  }

  async loadSettings() {
    const settings = await this.settingsService.getSettings();
    this.academyName = settings.academyName;
    this.academyEmail = settings.academyEmail;
    this.selectedPaymentOption = settings.selectedPaymentOption;
    this.notificationEnabled = settings.notificationEnabled;
  }

  async loadPaymentOptions() {
    this.paymentOptions = await this.settingsService.getPaymentOptions();
  }

  async updateSettings() {
    this.loading = true;
    try {
      await this.settingsService.updateSettings({
        academyName: this.academyName,
        academyEmail: this.academyEmail,
        selectedPaymentOption: this.selectedPaymentOption,
        notificationEnabled: this.notificationEnabled
      });
      this.notificationService.showSuccess('Settings updated successfully!');
    } catch (error) {
      this.notificationService.showError('Failed to update settings.');
    } finally {
      this.loading = false;
    }
  }
}
