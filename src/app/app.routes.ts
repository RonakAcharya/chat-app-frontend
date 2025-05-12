import { Routes } from '@angular/router';
import { ChatComponent } from './component/chat/chat/chat.component';
import { authGuard } from './guard/auth/auth.guard';
import { LoginComponent } from './component/login/login/login.component';
import { UserListComponent } from './component/user-list/user-list/user-list.component';
import { NewChatComponent } from './component/new-chat/new-chat/new-chat.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'user-list',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'user-list',
        component:UserListComponent,
        canActivate:[authGuard]
    },
    {
        path:'chat/:chatId',
        component:ChatComponent,
        canActivate:[authGuard]
    },
    {
        path:'new-chat',
        component:NewChatComponent,
        canActivate:[authGuard]
    }
];
