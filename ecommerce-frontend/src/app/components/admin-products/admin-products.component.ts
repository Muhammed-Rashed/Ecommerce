import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];

  // New product form fields
  newProduct: Product = {
    name: '',
    image: '',
    category: '',
    quantity: 0,
    price: 0,
    barId: '',
    inStock: true
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
    });
  }

  addProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(() => {
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
    });
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }
}
