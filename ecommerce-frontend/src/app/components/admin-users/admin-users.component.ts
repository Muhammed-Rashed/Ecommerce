import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchName = '';
  newUser: any = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    isVerified: true,
  };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  trackByUserId(index: number, user: any): string {
    return user._id;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        try {
          this.users = response.users || response || [];
          this.filteredUsers = [...this.users];
          this.isLoading = false;
        } catch (error) {
          console.error('Error processing users data:', error);
          this.errorMessage = 'Failed to process users data';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = error.error?.message || 'Failed to load users';
        this.isLoading = false;
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  addUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.errorMessage = 'Please fill in all required fields (name, email, password)';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.adminService.createUser(this.newUser).subscribe({
      next: () => {
        this.successMessage = 'User added successfully!';
        this.newUser = {
          name: '',
          email: '',
          password: '',
          role: 'user',
          isVerified: true,
        };
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error adding User:', error);
        this.errorMessage = error.error?.message || 'Failed to add user';
        this.isLoading = false;
      }
    });
  }

  searchUsers(): void {
    if (!Array.isArray(this.users)) {
      console.error('Users data is not an array:', this.users);
      this.filteredUsers = [];
      return;
    }
    
    const searchTerm = this.searchName.trim().toLowerCase();
    this.filteredUsers = searchTerm 
      ? this.users.filter(user => 
          user.name?.toLowerCase().includes(searchTerm) ||
          user.email?.toLowerCase().includes(searchTerm)
        )
      : [...this.users];
  }

  clearSearch(): void {
    this.searchName = '';
    this.filteredUsers = [...this.users];
  }

  deleteUser(id: string): void {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.successMessage = 'User deleted successfully!';
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.errorMessage = error.error?.message || 'Failed to delete user';
        this.isLoading = false;
      }
    });
  }

  updateUser(user: any): void {
    if (!user._id) {
      this.errorMessage = 'Cannot update user: missing ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.updateUser(user._id, user).subscribe({
      next: () => {
        this.successMessage = 'User updated successfully!';
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = error.error?.message || 'Failed to update user';
        this.isLoading = false;
      }
    });
  }

  toggleUserStatus(user: any): void {
    const originalStatus = user.isVerified;
    user.isVerified = !user.isVerified;
    
    this.adminService.updateUser(user._id, user).subscribe({
      next: () => {
        this.successMessage = `User ${user.isVerified ? 'verified' : 'unverified'} successfully!`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.errorMessage = error.error?.message || 'Failed to update user status';
        user.isVerified = originalStatus; // Revert on error
      }
    });
  }
}