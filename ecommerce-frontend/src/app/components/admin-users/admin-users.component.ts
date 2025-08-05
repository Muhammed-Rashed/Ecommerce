// admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchName = '';
  isLoading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  trackByUserId(index: number, user: any): string {
    return user._id;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        // Handle paginated response from backend
        this.users = response.users || response || [];
        this.filteredUsers = this.users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  searchUsers(): void {
    if (!Array.isArray(this.users)) {
      console.error('Users data is not an array:', this.users);
      return;
    }
    
    this.filteredUsers = this.searchName.trim() 
      ? this.users.filter(user => 
          user.name?.toLowerCase().includes(this.searchName.toLowerCase()) ||
          user.email?.toLowerCase().includes(this.searchName.toLowerCase())
        )
      : this.users;
  }

  clearSearch(): void {
    this.searchName = '';
    this.filteredUsers = this.users;
  }

  deleteUser(id: string): void {
    if (confirm('Delete this user?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = 'Failed to delete user';
        }
      });
    }
  }

  toggleUserStatus(user: any): void {
    user.isVerified = !user.isVerified;
    this.adminService.updateUser(user._id, user).subscribe({
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = 'Failed to update user';
        user.isVerified = !user.isVerified; // Revert on error
      }
    });
  }

  toggleAdminStatus(user: any): void {
    user.role = user.role === 'admin' ? 'user' : 'admin';
    this.adminService.updateUser(user._id, user).subscribe({
      error: (error) => {
        console.error('Error updating role:', error);
        this.errorMessage = 'Failed to update role';
        user.role = user.role === 'admin' ? 'user' : 'admin'; // Revert on error
      }
    });
  }
}