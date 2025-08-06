import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})

export class ProductCardComponent {
  @Input() product!: Product;

  addedToCart = false;
  adding = false;

  constructor(
    private cartService: CartService,
    private auth: AuthService 
  ) {}
  message = '';
  messageType: 'success' | 'error' | '' = '';
  
  addToCart() {
    const user = this.auth.getCurrentUser();

    if (!user) {
      this.message = 'Please log in or sign up first.';
      this.messageType = 'error';
      return;
    }

    if (!user.isVerified) {
      this.message = 'Please verify your email before adding to cart.';
      this.messageType = 'error';
      return;
    }

    if (!this.product._id || this.product.quantity === 0) return;

    const currentInCart = this.cartService.getQuantityForProduct(this.product._id);
    if (currentInCart >= this.product.quantity) {
      this.message = `Only ${this.product.quantity} available. You already have ${currentInCart} in your cart.`;
      this.messageType = 'error';
      return;
    }

    this.adding = true;

    this.cartService.addToCart(this.product._id, 1).subscribe({
      next: () => {
        this.cartService.refreshCart();
        this.addedToCart = true;
        this.message = 'Product added to cart!';
        this.messageType = 'success';
        this.adding = false;

        setTimeout(() => {
          this.addedToCart = false;
          this.message = '';
          this.messageType = '';
        }, 2000);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.message = 'Could not add to cart.';
        this.messageType = 'error';
        this.adding = false;
      }
    });
  }


}
