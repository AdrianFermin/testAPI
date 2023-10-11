import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BooksI } from '../models/books/books.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlBase = 'http://localhost:5136';

  constructor(private http: HttpClient) { }

  public getAllBooks(): Observable<BooksI[]>{
    let urlApi = '/api/Books';
    return this.http.get<BooksI[]>(this.urlBase + urlApi);
  }

  public getById(id: number): Observable<BooksI>{
    let urlApi = '/api/Books/' + id;
    return this.http.get<BooksI>(this.urlBase + urlApi);
  }

  public createBook(book: BooksI): Observable<BooksI>{
    let urlApi = '/api/Books';
    return this.http.post<BooksI>(this.urlBase + urlApi, book);
  }

  public updateBook(book: BooksI): Observable<BooksI>{
    let urlApi = '/api/Books/';
    return this.http.put<BooksI>(this.urlBase + urlApi + book.id, book);
  }

  public deleteBook(id: number): Observable<{}>{
    let urlApi = '/api/Books/';
    return this.http.delete(this.urlBase + urlApi + id);
  }
}
