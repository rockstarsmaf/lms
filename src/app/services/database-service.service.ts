import { Injectable } from '@angular/core';
import { Book } from '../model/Book';
import { Order } from '../model/Order';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { Cart } from '../model/Cart';

@Injectable({
  providedIn: 'root',
})
export class DatabaseServiceService {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('http://localhost:3000/books');
  }

  getAllOrders(): Observable<Order[]> {
    console.log('http://localhost:3000/orders?_sort=id&_order=desc');

    return this.http.get<Order[]>(
      'http://localhost:3000/orders?_sort=id&_order=desc'
    );
  }

  getOrdersByUserID(userId: any): Observable<Order[]> {
    console.log('http://localhost:3000/orders?userId=' + userId);

    return this.http.get<Order[]>(
      'http://localhost:3000/orders?userId=' +
        userId +
        '&_sort=borrowedDate&_order=desc'
    );
  }

  getOrdersById(orderId: any): Observable<Order> {
    return this.http.get<Order>('http://localhost:3000/orders/' + orderId);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/users');
  }

  returnBook(order: Order): Observable<Order> {
    order.hasReturned = true;
    const url = 'http://localhost:3000/orders/' + order.id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<Order>(url, order, httpOptions);
  }

  getUserByEmail(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(
      'http://localhost:3000/users?email=' + email + '&password=' + password
    );
  }

  getCartByUserId(userId: any): Observable<Cart[]> {
    return this.http.get<Cart[]>('http://localhost:3000/cart?userId=' + userId);
  }

  addBookInCart(cart: Cart): Observable<Cart> {
    const url = 'http://localhost:3000/cart/' + cart.id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<Cart>(url, cart, httpOptions);
  }

  updateCart(cart: Cart): Observable<Cart> {
    const url = 'http://localhost:3000/cart/' + cart.id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<Cart>(url, cart, httpOptions);
  }

  addOrder(order: Order): Observable<Order> {
    const url = 'http://localhost:3000/orders/';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<Order>(url, order, httpOptions);
  }

  getBookById(bookId: any): Observable<Book> {
    return this.http.get<Book>('http://localhost:3000/books?id=' + bookId);
  }

  updateBookcount(book: Book): Observable<Book> {
    const url = 'http://localhost:3000/books/' + book.id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put<Book>(url, book, httpOptions);
  }
}
