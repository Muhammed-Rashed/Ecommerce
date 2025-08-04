import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.auth.setAuthData(res.token, res.user);
        this.message = 'Account created! Please check your email to verify.';
        this.router.navigate(['/verify']);
      },
      error: (err) => {
        this.error = err.error.message || 'Signup failed.';
      }
    });
  }
}
