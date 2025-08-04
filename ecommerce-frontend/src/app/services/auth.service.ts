import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

// ✅ Helper to check if code is running in browser
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; // Your MongoDB-backed API
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (!isBrowser()) return;

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          this.currentUserSubject.next(decoded);
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    if (isBrowser()) {
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify/${token}`);
  }

  isLoggedIn(): boolean {
    return isBrowser() && !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.isAdmin || false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return isBrowser() ? localStorage.getItem('token') : null;
  }

  setAuthData(token: string, user: User): void {
    if (isBrowser()) {
      localStorage.setItem('token', token);
    }
    this.currentUserSubject.next(user);
  }
}
