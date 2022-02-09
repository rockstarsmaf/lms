import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { lastValueFrom } from 'rxjs';
import { Book } from 'src/app/model/Book';
import { Order } from 'src/app/model/Order';
import { User } from 'src/app/model/User';
import { DatabaseServiceService } from 'src/app/services/database-service.service';

@Component({
  selector: 'app-past-borrows',
  templateUrl: './past-borrows.component.html',
  styleUrls: ['./past-borrows.component.scss'],
})
export class PastBorrowsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'bookId',
    'userId',
    'borrowedDate',
    'hasReturned',
  ];
  orders: any;
  orderList: any;
  bookList: any;
  userList: any;
  totalBooksCount: number = 0;
  pageSize: number = 10;
  searchedInput: string = '';
  currentPageIndex = 0;

  isLoggedIn: boolean = false;
  userId: any = sessionStorage.getItem('userId');
  role: any = sessionStorage.getItem('role');
  userName: any = sessionStorage.getItem('userName');

  constructor(private databaseService: DatabaseServiceService) {}

  async ngOnInit() {
    if (this.userId != null) {
      this.isLoggedIn = true;
    }
    var data;
    if (this.role == 'student') {
      data = await this.databaseService
        .getOrdersByUserID(this.userName)
        .toPromise();
      this.orderList = data;
    } else {
      data = await this.databaseService.getAllOrders().toPromise();

      this.orderList = data;
    }
    var data2 = await this.databaseService.getBooks().toPromise();
    this.bookList = data2;
    var data3 = await this.databaseService.getUsers().toPromise();
    this.userList = data3;

    this.changeOrderFormat();
  }

  changeOrderFormat() {
    var orders: Order[];
    var books: Book[];
    var users: User[];
    orders = this.orderList;
    books = this.bookList;
    users = this.userList;
    for (var i = 0; i < orders.length; i++) {
      for (var j = 0; j < books.length; j++) {
        if (orders[i].bookId == books[j].id) {
          orders[i].bookId = books[j].bookName;
        }
      }
      for (var j = 0; j < users.length; j++) {
        if (orders[i].userId == users[j].id) {
          orders[i].userId =
            users[j].userFirstName + ' ' + users[j].userLastName;
        }
      }

      this.orders = orders;
      this.orderList = orders;
    }
  }

  changePage(event: PageEvent) {
    var tempOrders: Order[] = this.orderList;
    this.orderList = tempOrders.slice(
      event.pageIndex * this.pageSize,
      (event.pageIndex + 1) * this.pageSize
    );
  }

  filterBooks(event: any) {
    this.searchedInput = event.target.value;

    this.orderList = this.orders;
    var tempOrders: Order[] = this.orderList;
    var tempOrders2: Order[] = [];
    for (var i = 0; i < tempOrders.length; i++) {
      if (
        tempOrders[i].bookId.includes(this.searchedInput) ||
        tempOrders[i].userId.includes(this.searchedInput)
      ) {
        tempOrders2.push(tempOrders[i]);
      }
    }
    this.orderList = tempOrders2;
    this.totalBooksCount = this.orderList.length;
    this.orderList = this.orderList.slice(
      this.currentPageIndex * this.pageSize,
      (this.currentPageIndex + 1) * this.pageSize
    );
  }

  async returnBook(orderId: any) {
    var order: Order[] = [];
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id == orderId) {
        order.push(this.orders[i]);
      }
    }
    this.databaseService.returnBook(order[0]).subscribe((res) => res);

    var tempBook: Book[] = [];
    tempBook = this.getBookById(order[0].bookId);
    tempBook[0].stockQuantity++;
    await lastValueFrom(this.databaseService.updateBookcount(tempBook[0]));
  }

  getBookById(bookName: any) {
    var tempBookArray: Book[] = [];
    for (var i = 0; i < this.bookList.length; i++) {
      if (this.bookList[i].bookName == bookName) {
        tempBookArray.push(this.bookList[i]);
      }
    }
    return tempBookArray;
  }
}
