import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { Sesion } from '../interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private _snackBar: MatSnackBar) { }

  mostrarAlerta(mensaje: string, tipo: string, customCSS: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: customCSS
    });
  }

  guardarSesionUsuario(usuarioSesion: Sesion) {
    localStorage.setItem('usuario', JSON.stringify(usuarioSesion));
  }

  obtenerSesionUsuario() {
    const dataCadena = localStorage.getItem('usuario');
    const usuario = JSON.parse(dataCadena!);
    return usuario;
  }

  eliminarSesion() {
    localStorage.removeItem('usuario');
  }

}
