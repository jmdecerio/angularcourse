import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [
    { id: 1, nombre: 'Andrés', apellido: 'Guzmám', email: 'profesor@bolsaideas.com', createdAt: '2021-04-10'},
    { id: 2, nombre: 'Jorge', apellido: 'Martin', email: 'jmdecerio@gmail.com', createdAt: '2021-04-10'},
    { id: 3, nombre: 'Pepe', apellido: 'Gomez', email: 'pepe.gomez@gmail.com', createdAt: '2021-04-10'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
