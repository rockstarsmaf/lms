import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Book } from 'src/app/model/Book';
import { Cart } from 'src/app/model/Cart';
import { DatabaseServiceService } from 'src/app/services/database-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentPage: string = 'searchBooks';
  isLoggedIn: boolean = false;
  userId: any = sessionStorage.getItem('userId');
  role: any = sessionStorage.getItem('role');
  userName: any = sessionStorage.getItem('userName');
  cartCount: any;
  cart: Cart[] = [];

  constructor(
    private databaseService: DatabaseServiceService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (this.userId != null) {
      this.isLoggedIn = true;
    }
    if (this.isLoggedIn) {
      this.cart = await lastValueFrom(
        this.databaseService.getCartByUserId(this.userId)
      );
      this.cartCount = this.cart[0].BookId.length;
    }
  }

  ngOnChanges() {}

  navigateHeaderPage(page: any) {
    this.currentPage = page;
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigateByUrl('search');
  }
}
