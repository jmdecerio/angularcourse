import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] | undefined;

  constructor(private clienteService : ClienteService) {
  }

  ngOnInit(): void {
    this.clienteService.getClientes().pipe(
      tap(clientes => {
        console.log("Console tap3");
        clientes.forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    )
    .subscribe(
      clientes => this.clientes = clientes
    );
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
}
