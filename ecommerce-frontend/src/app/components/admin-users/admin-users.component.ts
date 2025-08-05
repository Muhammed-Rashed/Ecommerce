import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  searchName = '';
  apiUrl = 'http://localhost:5000/admin/users';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe(data => this.users = data);
  }

  searchUsers(): void {
    this.http.get<User[]>(`${this.apiUrl}?name=${this.searchName}`).subscribe(data => {
      this.users = data;
    });
  }

  updateUser(user: User): void {
    this.http.put(`${this.apiUrl}/${user._id}`, user).subscribe(() => {
      alert('User updated');
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
