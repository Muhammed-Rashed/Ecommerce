import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
    });

    this.cartService.refreshCart(); // Make sure to load cart items on init
  }

  updateQuantity(item: CartItem, quantityStr: string): void {
    const quantity = parseInt(quantityStr, 10);
    if (!quantity || quantity <= 0 || !item.product?._id) return;

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
    return this.cartItems.reduce((total, item) =>
      total + (item.product?.price || 0) * item.quantity, 0
    );
  }


  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.cartService.refreshCart();
    });
  }
}
