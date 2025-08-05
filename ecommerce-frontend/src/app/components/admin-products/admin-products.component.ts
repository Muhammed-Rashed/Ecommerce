// admin-products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchName = '';
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
  successMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.getAllProducts().subscribe({
      next: (response) => {
        try {
          this.products = response.products || response || [];
          this.filteredProducts = [...this.products];
          this.isLoading = false;
        } catch (error) {
          console.error('Error processing products data:', error);
          this.errorMessage = 'Failed to process products data';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = error.error?.message || 'Failed to load products';
        this.products = [];
        this.filteredProducts = [];
        this.isLoading = false;
      }
    });
  }

  searchProducts(): void {
    if (!Array.isArray(this.products)) {
      console.error('Products data is not an array:', this.products);
      this.filteredProducts = [];
      return;
    }
    
    const searchTerm = this.searchName.trim().toLowerCase();
    this.filteredProducts = searchTerm 
      ? this.products.filter(product => 
          product.name?.toLowerCase().includes(searchTerm) ||
          product.category?.toLowerCase().includes(searchTerm) ||
          product.barId?.toLowerCase().includes(searchTerm) ||
          String(product.price).includes(searchTerm)
        )
      : [...this.products];
  }

  clearSearch(): void {
    this.searchName = '';
    this.filteredProducts = [...this.products];
  }

  addProduct(): void {
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.category) {
      this.errorMessage = 'Please fill in all required fields (name, price, category)';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.adminService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.successMessage = 'Product added successfully!';
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
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.errorMessage = error.error?.message || 'Failed to add product';
        this.isLoading = false;
      }
    });
  }

  updateProduct(product: any): void {
    if (!product._id) {
      this.errorMessage = 'Cannot update product: missing ID';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.updateProduct(product._id, product).subscribe({
      next: () => {
        this.successMessage = 'Product updated successfully!';
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.errorMessage = error.error?.message || 'Failed to update product';
        this.isLoading = false;
      }
    });
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.deleteProduct(id).subscribe({
      next: () => {
        this.successMessage = 'Product deleted successfully!';
        this.loadProducts();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.errorMessage = error.error?.message || 'Failed to delete product';
        this.isLoading = false;
      }
    });
  }
}