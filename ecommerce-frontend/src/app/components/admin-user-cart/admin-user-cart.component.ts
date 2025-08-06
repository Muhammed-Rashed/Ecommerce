import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-user-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-cart.component.html',
  styleUrls: ['./admin-user-cart.component.css']
})
export class AdminUserCartComponent implements OnInit {
  @Input() userId!: string;

  cartItems: any[] = [];
  loading = false;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.fetchCart();
    }
  }

  fetchCart(): void {
    this.loading = true;
    this.error = '';

    this.adminService.getCartItemsByUserId(this.userId).subscribe({
      next: (cart) => {
        this.cartItems = cart || []; // Assuming it returns a list
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load user cart.';
        this.loading = false;
      }
    });
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  }

  updateCartItem(item: any): void {
    this.adminService.updateUserCartItem(this.userId, item.product._id, item.quantity).subscribe({
      next: () => {
        this.fetchCart();
      },
      error: (err) => {
        console.error('Failed to update cart item:', err);
        this.error = 'Failed to update cart item.';
      }
    });
  }

  removeCartItem(productId: string): void {
    this.adminService.removeUserCartItem(this.userId, productId).subscribe({
      next: () => {
        this.fetchCart();
      },
      error: (err) => {
        console.error('Failed to remove cart item:', err);
        this.error = 'Failed to remove cart item.';
      }
    });
  }

}
