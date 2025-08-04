import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [NavbarComponent, RouterModule],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce-app';
  
  constructor(public authService: AuthService) {}
}