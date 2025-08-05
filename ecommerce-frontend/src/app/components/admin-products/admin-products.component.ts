import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Product {
  _id?: string;
  name: string;
  image: string;
  category: string;
  quantity: number;
  price: number;
  barId: string;
  inStock: boolean;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = {
    name: '',
    image: '',
    category: '',
    quantity: 0,
    price: 0,
    barId: '',
    inStock: true
  };
  apiUrl = 'http://localhost:5000/admin/products';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe(data => this.products = data);
  }

  addProduct(): void {
    this.http.post<Product>(this.apiUrl, this.newProduct).subscribe(() => {
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

  updateProduct(product: Product): void {
    if (!product._id) return;
    this.http.put(`${this.apiUrl}/${product._id}`, product).subscribe(() => {
      alert('Product updated');
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Delete this product?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.loadProducts());
    }
  }
}
