import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { VentaComponent } from './pages/venta/venta.component';
import { HistorialVentaComponent } from './pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { SharedModule } from 'src/app/reusable/shared/shared.module';
import { ModalUsuarioComponent } from './modals/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './modals/modal-producto/modal-producto.component';
import { ModalDetalleVentaComponent } from './modals/modal-detalle-venta/modal-detalle-venta.component';
import { NumberDirective } from 'src/app/reusable/numbers-only.directive';


@NgModule({
  declarations: [
    DashboardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetalleVentaComponent,
    NumberDirective
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
