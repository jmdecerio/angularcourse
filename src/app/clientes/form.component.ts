import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: string = "Formulario de Cliente:";

  constructor(private clienteService: ClienteService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.route.params.subscribe(
      params => {
        let id = params['id'];
        if (id) {
          this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
        }
      }
    );
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['../'], { relativeTo: this.route });
        swal.fire("El cliente ha sido creado con éxito", `${cliente.nombre}`, 'success');
      }
    );
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['../..'], { relativeTo: this.route });
        swal.fire(`${json.mensaje}:`, `${json.cliente.nombre}`, 'success');
      }
    )
  }
}
