import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;

  addedToCart = false;
  adding = false;

  constructor(private cartService: CartService) {}

  addToCart() {
    if (!this.product._id || this.product.quantity === 0) return;

    this.adding = true;

    this.cartService.addToCart(this.product._id, 1).subscribe({
      next: () => {
        this.cartService.refreshCart();
        this.addedToCart = true;
        this.adding = false;
        setTimeout(() => this.addedToCart = false, 2000);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.adding = false;
      }
    });
  }
}
