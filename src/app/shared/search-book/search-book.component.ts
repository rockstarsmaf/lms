import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { Book } from 'src/app/model/Book';
import { Cart } from 'src/app/model/Cart';
import { DatabaseServiceService } from 'src/app/services/database-service.service';

@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.scss'],
})
export class SearchBookComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'bookName',
    'authorName',
    'isbnNumber',
    'price',
    'stockQuantity',
  ];
  books: Book[] = [];
  booksList: any;
  totalBooksCount: number = 0;
  pageSize: number = 8;
  searchedInput: string = '';
  currentPageIndex = 0;
  isLoggedIn: boolean = false;
  userId: any = sessionStorage.getItem('userId');
  role: any = sessionStorage.getItem('role');
  userName: any = sessionStorage.getItem('userName');

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private databaseService: DatabaseServiceService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    if (this.userId != null) {
      this.isLoggedIn = true;
    }

    var data = await this.databaseService.getBooks().toPromise();
    this.booksList = data;
    this.books = this.booksList;
    this.totalBooksCount = this.books.length;
    this.books = this.books.slice(0, this.pageSize);
  }

  changePage(event: PageEvent) {
    var tempBooks: Book[] = this.booksList;
    this.books = tempBooks.slice(
      event.pageIndex * this.pageSize,
      (event.pageIndex + 1) * this.pageSize
    );
  }

  filterBooks(event: any) {
    this.searchedInput = event.target.value;

    var tempBooks: Book[] = this.booksList;
    var tempBooks2: Book[] = [];
    for (var i = 0; i < tempBooks.length; i++) {
      if (
        tempBooks[i].bookName.includes(this.searchedInput) ||
        tempBooks[i].authorName.includes(this.searchedInput)
      ) {
        tempBooks2.push(tempBooks[i]);
      }
    }
    this.books = tempBooks2;
    this.totalBooksCount = this.books.length;
    this.books = this.books.slice(
      this.currentPageIndex * this.pageSize,
      (this.currentPageIndex + 1) * this.pageSize
    );
  }

  async addBookToCart(bookId: any) {
    var cart: Cart[] = await lastValueFrom(
      this.databaseService.getCartByUserId(this.userId)
    );

    cart[0].BookId.push(bookId);

    await lastValueFrom(this.databaseService.addBookInCart(cart[0]));

    this.openSnackBar('Book Added');
  }

  openSnackBar(description: string) {
    this._snackBar.open(description, 'Okay', {
      duration: 2 * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
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
