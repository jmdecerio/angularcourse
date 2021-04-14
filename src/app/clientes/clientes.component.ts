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
    let page = 0;
    this.clienteService.getClientes(page).pipe(
      tap(response => {
        console.log("Console tap3");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    )
    .subscribe(
      response => this.clientes = response.content as Cliente[]
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
