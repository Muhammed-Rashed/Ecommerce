import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/admin';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCartItemsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/cart`, {
      headers: this.getHeaders()
    });
  }

  updateUserCartItem(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}/cart`, {
      productId,
      quantity
    }, {
      headers: this.getHeaders()
    });
  }

  removeUserCartItem(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}/cart/${productId}`, {
      headers: this.getHeaders()
    });
  }

  // User Management
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users`, { headers: this.getHeaders() });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, userData, { headers: this.getHeaders() });
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, userData, { headers: this.getHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  // Product Management
  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products`, { headers: this.getHeaders() });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders() });
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, productData, { headers: this.getHeaders() });
  }

  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, productData, { headers: this.getHeaders() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders() });
  }
}