import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  protected _router = inject(Router);
  protected _SocketService = inject(SocketService);

  currentUser: any;
  chatList: any[] = [];

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this._SocketService.getChats(this.currentUser.email).subscribe(chats => {
      const uniqueChats = new Map();
      chats.forEach(chat => {
        const key = chat.chatId || `${chat.withEmail}-${chat.withName}`;
        if (!uniqueChats.has(key)) {
          uniqueChats.set(key, chat);
        }
      });
      this.chatList = Array.from(uniqueChats.values());
    });
  }
  

  openChat(chat: any) {
    this._router.navigate(['/chat', chat.chatId]);
  }

  startNewChat() {
    this._router.navigate(['/new-chat']);
  }
}
