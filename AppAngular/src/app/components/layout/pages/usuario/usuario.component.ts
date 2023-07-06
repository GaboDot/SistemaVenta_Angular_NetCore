import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../modals/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilityService } from 'src/app/reusable/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnsTable: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'status', 'acciones'];
  dataInicio: Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) pagTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioService: UsuarioService,
    private _utilityService: UtilityService
  ) {}

  obtenerUsuarios() {
    this._usuarioService.lista().subscribe({
      next: (response) => {
        if(response.status) this.dataListaUsuarios.data = response.value;
        else this._utilityService.mostrarAlerta('No se encontraron usuarios.', 'Cerrar');
      },
      error: (e) => {}
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.pagTable;
  }

  aplicarFiltros(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase();
  }

  nuevoUsuario() { 
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe((result) => {
      if(result === 'true') this.obtenerUsuarios();
    });
  }

  editarUsuario(usuario: Usuario) { 
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe((result) => {
      if(result === 'true') this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Deseas eliminar el usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        this._usuarioService.eliminar(usuario.idUsuario).subscribe({
          next: (response) => {
            if(response.status) {
              this._utilityService.mostrarAlerta('Se eliminó el usuario', 'Cerrar');
              this.obtenerUsuarios();
            }
            else {
              this._utilityService.mostrarAlerta('No se pudo eliminar el usuario', 'Cerrar');
            }
          },
          error: (e) => {}
        });
      }
    });
  }
}
