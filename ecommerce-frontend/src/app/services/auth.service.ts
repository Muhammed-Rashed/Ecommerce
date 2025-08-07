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
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';
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
          const user: User = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
            isVerified: decoded.isVerified,
            role: decoded.role
          };
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData);
  }

  login(credentials: any): Observable<AuthResponse> {
    return new Observable<AuthResponse>((observer) => {
      this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
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
    return !!(user?.isAdmin || user?.role === 'admin');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return isBrowser() ? localStorage.getItem('token') : null;
  }

  setAuthData(token: string): void {
    if (isBrowser()) {
      localStorage.setItem('token', token);
      try {
        const decoded: any = jwtDecode(token);

        const user: User = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          isVerified: decoded.isVerified,
          role: decoded.role,
          isAdmin: decoded.role === 'admin'
        };

        this.currentUserSubject.next(user);
      } catch (err) {
        console.error('Invalid token:', err);
        this.logout();
      }
    }
  }

}
