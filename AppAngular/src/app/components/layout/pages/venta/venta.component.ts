import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/venta.service';
import { UtilityService } from 'src/app/reusable/utility.service';
import { Producto } from 'src/app/interfaces/producto';
import { Venta } from 'src/app/interfaces/venta';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent {

}
