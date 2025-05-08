import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 
  protected _router = inject(Router)
  name = '';
  email = '';

  login() {
    localStorage.setItem('user', JSON.stringify({ name: this.name, email: this.email }));
    this._router.navigate(['/user-list']);
  }
}
