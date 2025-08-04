import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/cart'; // Your cart routes
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addToCart(productId: string, quantity: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, 
      { productId, quantity }, 
      { headers: this.getHeaders() }
    );
  }

  updateCartItem(itemId: string, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${itemId}`, 
      { quantity }, 
      { headers: this.getHeaders() }
    );
  }

  removeFromCart(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemId}`, { headers: this.getHeaders() });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, { headers: this.getHeaders() });
  }

  refreshCart(): void {
    this.getCartItems().subscribe(items => {
      this.cartItemsSubject.next(items);
    });
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  }
}