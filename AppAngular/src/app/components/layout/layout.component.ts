import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';
import { UtilityService } from 'src/app/reusable/utility.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{

  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = '';

  constructor(
    private router: Router,
    private _menuService: MenuService,
    private _utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    const usuario = this._utilityService.obtenerSesionUsuario();
    if(usuario != null) {
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;
      this._menuService.lista(usuario.idUsuario).subscribe({
        next: (response) => {
          if(response.status) this.listaMenus = response.value;
        },
        error: (e) => {}
      });
    }
  }

  cerrarSesion() {
    this._utilityService.eliminarSesion();
    this.router.navigate(['login']);
  }
}
