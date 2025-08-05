// admin-products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  newProduct: any = {
    name: '',
    image: '',
    category: '',
    quantity: 0,
    price: 0,
    barId: '',
    inStock: true
  };
  isLoading = false;
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.adminService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products';
        this.isLoading = false;
      }
    });
  }

  addProduct(): void {
    this.isLoading = true;
    this.adminService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.newProduct = {
          name: '',
          image: '',
          category: '',
          quantity: 0,
          price: 0,
          barId: '',
          inStock: true
        };
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.errorMessage = 'Failed to add product';
        this.isLoading = false;
      }
    });
  }

  updateProduct(product: any): void {
    if (!product._id) return;
    
    this.isLoading = true;
    this.adminService.updateProduct(product._id, product).subscribe({
      next: () => this.isLoading = false,
      error: (error) => {
        console.error('Error updating product:', error);
        this.errorMessage = 'Failed to update product';
        this.isLoading = false;
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Delete this product?')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (error) => {
          console.error('Error deleting product:', error);
          this.errorMessage = 'Failed to delete product';
        }
      });
    }
  }
}