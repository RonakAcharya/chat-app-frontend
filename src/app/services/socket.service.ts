import { Injectable } from '@angular/core';
import {io,Socket} from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private _socket:Socket;
  // private readonly uri = 'http://localhost:3000';
   private readonly uri = 'https://chat-backend-lr.onrender.com';

  constructor() {
    this._socket = io(this.uri);
   }

   sendMessage(msg: any) {
    this._socket.emit('message',msg);
   }

   getMessage():Observable<any>{
    return new Observable(observer =>{
       this._socket.on('message',(msg:string)=>{
         observer.next(msg);
       })
    })
   }

   getMessageHistory(): Observable<any[]> {
    return new Observable(observer => {
      this._socket.on('loadMessages', (msgs) => {
        observer.next(msgs);
      });
    });
  }

  loadMessages(chatId: string): Observable<any[]> {
    this._socket.emit('loadMessages', chatId);
    return new Observable(observer => {
      this._socket.on('loadMessages', msgs => observer.next(msgs));
    });
  }

  getChats(userEmail:string):Observable<any[]>{
    this._socket.emit('getChats',userEmail);
    return new Observable(observer =>{
      this._socket.on('chatList',(chats) => observer.next(chats));
    })
  }

  checkOrCreateChat(from:string,to:string):Observable<any>{
    this._socket.emit('createChat',{from,to});
    return new Observable(observer =>{
      this._socket.on('chatCreated',(chat)=> observer.next(chat));
    })
  }

getChatDetails(chatId: string) {
  return new Observable((observer) => {
    this._socket.emit('getChatDetails', chatId);  // Emit event to server
    this._socket.on('chatDetails', (chat) => {
      observer.next(chat);  // Send the chat details back to the component
    });
  });
}

}
