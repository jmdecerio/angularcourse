import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from './cliente';
//import { CLIENTES } from './clientes.json';
//import { of } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndpoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});

  constructor(private http : HttpClient,
    private router: Router) { }

  getClientes() : Observable<Cliente[]> {
    // 1. return of(CLIENTES);
    // 2. return this.http.get<Cliente[]>(this.urlEndpoint);
    return this.http.get(this.urlEndpoint).pipe(
      tap(response => {
        console.log("Console tap1");
        let clientes = response as Cliente[];
        clientes.forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
      map(response =>
        {
          let clientes = response as Cliente[];
          return clientes.map(cli => {
            cli.nombre = cli.nombre.toUpperCase();
            //let datePipe = new DatePipe("es");
            //cli.createdAt = datePipe.transform(cli.createdAt, 'EEEE dd, MMMM yyyy');
            //cli.createdAt = datePipe.transform(cli.createdAt, 'fullDate'); //formatDate(cli.createdAt, 'dd-MM-yyyy', 'en-US');
            return cli;
          });
      }),
      tap(response => {
        console.log("Console tap2");
        response.forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    );
  }

  create(cliente: Cliente) : Observable<Cliente> {
    return this.http.post(this.urlEndpoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status==400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id: number) : Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al Editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente) : Observable<any> {
    return this.http.put<any>(`${this.urlEndpoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if (e.status==400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number) : Observable<any> {
    return this.http.delete<any>(`${this.urlEndpoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
