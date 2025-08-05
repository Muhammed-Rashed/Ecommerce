import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  name = '';
  newName = '';
  oldPassword = '';
  newPassword = '';
  message = '';
  error = '';

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.name = user.name;
      this.newName = user.name;
    }
  }

  updateProfile(): void {
    if (!this.oldPassword) {
      this.error = 'Old password is required';
      return;
    }

    const updateData = {
      name: this.newName,
      oldPassword: this.oldPassword,
      password: this.newPassword
    };

    this.http.put<any>('http://localhost:5000/users/profile', updateData, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.error = '';
        this.name = res.user.name;
        this.oldPassword = '';
        this.newPassword = '';
      },
      error: (err) => {
        this.error = err.error.message || 'Update failed';
        this.message = '';
      }
    });
  }
}
