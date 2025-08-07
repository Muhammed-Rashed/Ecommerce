import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  filteredCartItems: CartItem[] = [];
  searchQuery = '';

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.filterCartItems(); // Apply search filter after update
    });

    this.cartService.refreshCart();
  }

  filterCartItems(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredCartItems = this.cartItems.filter(item =>
      item.product?.name.toLowerCase().includes(query)
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterCartItems();
  }

  updateQuantity(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);

    const stock = item.product?.quantity ?? 0;

    if (!quantity || quantity <= 0) {
      alert('Quantity must be at least 1.');
      input.value = item.quantity.toString();
      return;
    }

    if (quantity > stock) {
      alert(`Only ${stock} items in stock.`);
      input.value = item.quantity.toString();
      return;
    }

    if (!item.product?._id) return;

    this.cartService.updateCartItem(item.product._id, quantity).subscribe(() => {
      this.cartService.refreshCart();
    });
  }


  removeItem(item: CartItem): void {
    const productId = item.product?._id;
    if (!productId) return;

    this.cartService.removeFromCart(productId).subscribe(() => {
      this.cartService.refreshCart();
    });
  }

  getTotal(): number {
    return this.filteredCartItems.reduce((total, item) =>
      total + (item.product?.price || 0) * item.quantity, 0
    );
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.cartService.refreshCart();
    });
  }
}
