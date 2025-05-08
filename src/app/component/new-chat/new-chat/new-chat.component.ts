import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.scss'
})
export class NewChatComponent {

  protected _router = inject(Router);
  protected _SocketService = inject(SocketService);
  
  email = '';
  currentUser: any;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  }

  startChat() {
    if (this.email === this.currentUser.email || !this.email.trim()) return;
  
    // First, get existing chats
    this._SocketService.getChats(this.currentUser.email).subscribe(chats => {
      const existingChat = chats.find(chat => chat.withEmail === this.email);
  
      if (existingChat) {
        // If chat already exists, navigate to it
        this._router.navigate(['/chat', existingChat.chatId]);
      } else {
        // Otherwise, create a new chat
        this._SocketService.checkOrCreateChat(this.currentUser.email, this.email).subscribe(chat => {
          this._router.navigate(['/chat', chat.chatId]);
        });
      }
    });
  }
  
}
