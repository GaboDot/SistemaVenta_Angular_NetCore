import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilityService } from 'src/app/reusable/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioService : UsuarioService,
    private _utilityService: UtilityService
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  iniciarSesion() {
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    }
    this._usuarioService.iniciarSesion(request).subscribe({
      next: (data) => {
        if(data.status) {
          this._utilityService.guardarSesionUsuario(data.value);
          this.router.navigate(['pages']);
        }
        else {
          this._utilityService.mostrarAlerta('Usuario o clave incorrectos', 'Cerrar');
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: () => {
        this._utilityService.mostrarAlerta('Error al iniciar sesión', 'Cerrar');
      }
    });
  }
}
