import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import { ActivatedRoute } from '@angular/router';

import { tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService : ClienteService,
              private modalService : ModalService,
              private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.activateRoute.paramMap.subscribe(params => {
      let page = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).pipe(
        tap(response => {
          console.log("Console tap3");
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          });
        })
      )
      .subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
    });
  }

  delete(cliente : Cliente) : void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `Quiere borrar ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.clienteService.delete(cliente.id).subscribe(
              response => this.clientes = this.clientes.filter( cli => cli != cliente)
            );
            swalWithBootstrapButtons.fire(
              'Borrado!',
              'El cliente ha sido borrado.',
              'success'
            );
          }
        });
    }

    abrirModal(cliente: Cliente) {
      this.clienteSeleccionado = cliente;
      this.modalService.abrirModal();
    }
}
