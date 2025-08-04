import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  apiUrl = 'http://localhost:3000/api/user'; // Your user routes

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe(data => {
      this.users = data;
    });
  }

  deleteUser(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.loadUsers();
    });
  }
}
