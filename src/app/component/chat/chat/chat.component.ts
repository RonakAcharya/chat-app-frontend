import { Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {AvatarModule} from 'ngx-avatars';

// interface ChatMessage {
//   id: string;
//   from: string;
//   to: string;
//   message: string;
//   timestamp: number;
// }

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule,AvatarModule,RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  protected _socketService = inject(SocketService);
  protected _route =  inject(ActivatedRoute);
  chatId = '';
  currentUser: any;
  targetUser: any;
  message = '';
  messages: any[] = [];
  chat : any;
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.chatId = this._route.snapshot.paramMap.get('chatId') || '';
    this._socketService.loadMessages(this.chatId).subscribe(msgs => {
      this.messages = msgs;
    });
    // Emit event to get the chat details based on chatId
    this._socketService.getChatDetails(this.chatId).subscribe((chat:any) => {
      this.chat = chat;
      // this.messages = chat.messages || [];
      this.extractTargetUser();
    });
  
    this._socketService.getMessage().subscribe(msg => {
      if (msg.chatId === this.chatId) {
        this.messages.push(msg);
        this.extractTargetUser();
      }
    });
    this.adjustHeight();
    window.addEventListener('resize', this.adjustHeight.bind(this)); 
  }

  ngOnDestroy() {
    // Clean up the event listener when the component is destroyed
    window.removeEventListener('resize', this.adjustHeight.bind(this));
  }

   // Adjust the height of the chat container
   private adjustHeight() {
    const chatContainer = this.el.nativeElement.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.style.height = `${window.innerHeight}px`;  // Set the height based on the window height
    }
  }

  extractTargetUser() {
    const otherUserEmail = this.chat.users.find((user: any) => user !== this.currentUser.email);
    
    if (otherUserEmail) {
      // Extract name (from the names object or email)
      const userName = this.chat.names[otherUserEmail] || otherUserEmail;
  
      // Set the avatar as the email initials or name for ngx-avatar
      this.targetUser = {
        email: otherUserEmail,
        name: userName,
        avatar: userName // Set name or initials as avatar text
      };
    }
  }
  
  
  send() {
    if (this.message.trim()) {
      const msg = {
        id: crypto.randomUUID(),
        chatId: this.chatId,
        from: this.currentUser.email,
        message: this.message,
        timestamp: Date.now()
      };
      this._socketService.sendMessage(msg);
            this.message = '';
    }
  }
}

