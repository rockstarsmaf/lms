import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Book } from 'src/app/model/Book';
import { Order } from 'src/app/model/Order';
import { User } from 'src/app/model/User';
import { DatabaseServiceService } from 'src/app/services/database-service.service';

@Component({
  selector: 'app-manage-book',
  templateUrl: './manage-book.component.html',
  styleUrls: ['./manage-book.component.scss'],
})
export class ManageBookComponent implements OnInit {
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
  pageSize: number = 8;
  searchedInput: string = '';
  currentPageIndex = 0;
  role: string = 'admin';

  constructor(private databaseService: DatabaseServiceService) {}

  async ngOnInit() {
    var data = await this.databaseService.getAllOrders().toPromise();
    this.orderList = data;
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
}
