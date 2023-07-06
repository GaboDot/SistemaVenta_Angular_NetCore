import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/interfaces/rol';
import { Usuario } from 'src/app/interfaces/usuario';
import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilityService } from 'src/app/reusable/utility.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloModal: string = 'Agregar';
  botonModal: string = 'Guardar';
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolService: RolService,
    private _usuarioService: UsuarioService,
    private _utilityService: UtilityService
  ) {
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', Validators.required],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });

    if(this.datosUsuario != null) {
      this.tituloModal = 'Editar';
      this.botonModal = 'Actualizar';
    }

    this._rolService.lista().subscribe({
      next: (response) => {
        if(response.status) this.listaRoles = response.value;
      },
      error: (e) => {}
    });
  }

  ngOnInit(): void {
    if(this.datosUsuario != null) {
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      });
    }
  }

  guardarEditarUsuario() {

    const _usuario: Usuario = {
      idUsuario: this.datosUsuario== null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    };

    if(this.datosUsuario == null) {
      this._usuarioService.guardar(_usuario).subscribe({
        next: (response) => {
          if(response.status) {
            this._utilityService.mostrarAlerta('El usuario se registró correctamente', 'Cerrar', 'notif-success');
            this.modalActual.close('true');
          }
          else {
            this._utilityService.mostrarAlerta('No se pudo registrar el usuario', 'Cerrar', 'notif-error');
          }
        },
        error: (e) => {}
      });
    }
    else {
      this._usuarioService.editar(_usuario).subscribe({
        next: (response) => {
          if(response.status) {
            this._utilityService.mostrarAlerta('El usuario se actualizó correctamente', 'Cerrar', 'notif-success');
            this.modalActual.close('true');
          }
          else {
            this._utilityService.mostrarAlerta('No se pudo actualizar el usuario', 'Cerrar', 'notif-error');
          }
        },
        error: (e) => {}
      });
    }
  } 
}
