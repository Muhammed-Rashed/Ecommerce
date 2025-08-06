import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}
  signup(): void {
    this.error = '';
    this.message = '';

    if (!this.name || !this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.message = 'Account created! Please check your email to verify.';
        this.router.navigate(['/verify']);
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Signup failed. Please try again.';
      }
    });
  }
}
