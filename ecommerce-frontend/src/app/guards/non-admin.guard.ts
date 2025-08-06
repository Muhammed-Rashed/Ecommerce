import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NonAdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getCurrentUser();

    if (user && user.role === 'admin') {
      // Redirect admins to admin dashboard (or home)
      this.router.navigate(['/admin']);
      return false;
    }

    return true; // Allow access if not admin
  }
}
