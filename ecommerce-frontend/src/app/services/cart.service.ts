import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  _id?: string;
  product: Product | null;
  quantity: number;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:5000/cart';
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
    return this.http.get<CartItem[]>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }

  addToCart(productId: string, quantity: number = 1): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.baseUrl}/add`, { productId, quantity }, {
      headers: this.getHeaders()
    });
  }

  updateCartItem(productId: string, quantity: number): Observable<CartItem> {
    return this.addToCart(productId, quantity);
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/remove`, 
      { productId }, 
      { headers: this.getHeaders() }
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear`, {
      headers: this.getHeaders()
    });
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
      total + ((item.product?.price ?? 0) * item.quantity), 0
    );
  }
}
