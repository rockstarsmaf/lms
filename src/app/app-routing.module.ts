import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { CartComponent } from './shared/cart/cart.component';
import { LoginComponent } from './shared/login/login.component';
import { ManageBookComponent } from './shared/manage-book/manage-book.component';
import { PastBorrowsComponent } from './shared/past-borrows/past-borrows.component';
import { SearchBookComponent } from './shared/search-book/search-book.component';

const routes: Routes = [
  { path: '',  redirectTo:'/search', pathMatch:'full'},
  { path: 'search', component: SearchBookComponent },
  { path: 'transactions', component: PastBorrowsComponent,canActivate:[AuthGuard] },
  { path: 'manageBook', component: ManageBookComponent,canActivate:[AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'cart', component: CartComponent,canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routingComponents = [
  SearchBookComponent,
  LoginComponent,
  PastBorrowsComponent,
  ManageBookComponent,
  CartComponent,
];
