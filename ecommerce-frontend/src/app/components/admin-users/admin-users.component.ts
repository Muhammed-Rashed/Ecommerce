import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { AdminUserCartComponent } from '../admin-user-cart/admin-user-cart.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminUserCartComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  userCartItems: { [userId: string]: any[] } = {};
  selectedCartUserId: string | null = null;
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

  constructor(private adminService: AdminService,
    private authService: AuthService
  ) {}

  currentUserId: string | null = null;
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id || null;
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
    // Validation
    if (!user._id) {
      this.errorMessage = 'Cannot update user: missing ID';
      return;
    }

    if (!user.name?.trim() || !user.email?.trim()) {
      this.errorMessage = 'Name and email are required';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Prepare update data - only send fields that can be updated
    const updateData = {
      name: user.name.trim(),
      email: user.email.trim(),
      role: user.role,
      isVerified: user.isVerified
    };
    
    this.adminService.updateUser(user._id, updateData).subscribe({
      next: (response) => {
        this.successMessage = 'User updated successfully!';
        this.isLoading = false;
        
        // Update the user in the local array with the response data
        const index = this.users.findIndex(u => u._id === user._id);
        if (index !== -1 && response.user) {
          this.users[index] = { ...this.users[index], ...response.user };
          this.searchUsers(); // Refresh filtered users
        }
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  toggleUserStatus(user: any): void {
    if (!user._id) {
      this.errorMessage = 'Cannot update user: missing ID';
      return;
    }

    const originalStatus = user.isVerified;
    const newStatus = !user.isVerified;
    
    // Optimistically update UI
    user.isVerified = newStatus;
    
    // Prepare minimal update data
    const updateData = {
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: newStatus
    };
    
    this.adminService.updateUser(user._id, updateData).subscribe({
      next: () => {
        this.successMessage = `User ${newStatus ? 'verified' : 'unverified'} successfully!`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.errorMessage = this.getErrorMessage(error);
        // Revert the optimistic update
        user.isVerified = originalStatus;
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors.join(', ');
    }
    if (error.status === 400) {
      return 'Invalid data provided';
    }
    if (error.status === 404) {
      return 'User not found';
    }
    if (error.status === 500) {
      return 'Server error occurred';
    }
    return 'Failed to update user';
  }

  viewUserCart(userId: string): void {
    if (this.selectedCartUserId === userId) {
      this.selectedCartUserId = null; // collapse if already selected
      return;
    }

    this.selectedCartUserId = userId;
    this.errorMessage = '';

    // If cart already loaded, no need to fetch again
    if (this.userCartItems[userId]) return;

    this.adminService.getCartItemsByUserId(userId).subscribe({
      next: (cartItems) => {
        this.userCartItems[userId] = cartItems;
      },
      error: (error) => {
        console.error('Error loading user cart:', error);
        this.errorMessage = error.error?.message || 'Failed to load user cart';
      }
    });
  }

}