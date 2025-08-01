import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule] // Add CommonModule to imports
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        // Handle 2FA if needed, otherwise navigate
        if (response.twoFactorRequired) {
          alert("twoFactorRequired")
          this.errorMessage = 'Two-factor authentication is required. Please verify your code.';
          // You might want to navigate to a 2FA verification page here
        } else {
          alert("this.router.navigate(['/products']);")
          this.router.navigate(['/products']); // Navigate to products page on successful login
        }
      },
      error: (error) => {
        this.errorMessage = 'Login failed: ' + (error.error?.message || error.message || 'Unknown error');
        console.error('Login error:', error);
      }
    });
  }
}
