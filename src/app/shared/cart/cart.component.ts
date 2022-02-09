import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Book } from 'src/app/model/Book';
import { Cart } from 'src/app/model/Cart';
import { Order } from 'src/app/model/Order';
import { DatabaseServiceService } from 'src/app/services/database-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  isLoggedIn: boolean = false;
  userId: any = sessionStorage.getItem('userId');
  role: any = sessionStorage.getItem('role');
  userName: any = sessionStorage.getItem('userName');

  cart: Cart[] = [];
  booksInCart: Book[] = [];
  books: Book[] = [];

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
      this.books = await lastValueFrom(this.databaseService.getBooks());

      this.changeOrderFormat();
    }
  }

  changeOrderFormat() {
    for (var j = 0; j < this.cart[0].BookId.length; j++) {
      for (var k = 0; k < this.books.length; k++) {
        if (this.cart[0].BookId[j] == this.books[k].id) {
          this.booksInCart.push(this.books[k]);
        }
      }
    }
  }

  async checkoutCart() {
    // books present in the cart
    var bookArray = this.cart[0].BookId;
    // empty the cart
    this.cart[0].BookId = [];

    // creating order entity for plcaing the order and entering it in orders table
    for (var i = 0; i < bookArray.length; i++) {
      var tempBook = this.getBookById(bookArray[i]);
      var order: Order = {
        id: '',
        bookId: tempBook[0].bookName,
        userId: this.userName,
        borrowedDate: new Date(),
        hasReturned: false,
      };

      tempBook[0].stockQuantity--;
      await lastValueFrom(this.databaseService.updateBookcount(tempBook[0]));
      // inserting in orders table
      await lastValueFrom(this.databaseService.addOrder(order));
      // updating cart so every book gets out of cart
      await lastValueFrom(this.databaseService.updateCart(this.cart[0]));

      this.router.navigateByUrl('transactions');
    }
  }

  getBookById(bookID: any) {
    var tempBookArray: Book[] = [];
    for (var i = 0; i < this.books.length; i++) {
      if (this.books[i].id == bookID) {
        tempBookArray.push(this.books[i]);
      }
    }
    return tempBookArray;
  }
}
