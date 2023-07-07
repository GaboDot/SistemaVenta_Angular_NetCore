import { Component, OnInit } from '@angular/core';
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
export class VentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaProductosVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;
  productoSeleccionado!: Producto;
  tipoPagoPorDefecto: string = 'Efectivo';
  totalPagar: number = 0;

  formularioProductoVenta: FormGroup;
  columnsTable: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);

  productosFiltrados(busqueda: any): Producto[] {
    const _valorBuscado = typeof(busqueda) === 'string' ? busqueda.toLowerCase() : busqueda.nombre.toLowerCase;
    return this.listaProductos.filter(item => item.nombre.toLowerCase().includes(_valorBuscado));
  }

  constructor(
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _ventaService: VentaService,
    private _utilityService: UtilityService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
    });

    this._productoService.lista().subscribe({
      next: (response) => {
        const _lista = response.value as Producto[];
        this.listaProductos = _lista.filter(p => p.esActivo == 1 && p.stock > 0);
      },
      error: (e) => {}
    });

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.productosFiltrados(value);
    });
  }

  
  ngOnInit(): void {}

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoVenta() {
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2))
    });

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);

    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: ''
    });
  }

  eliminarProductoVenta(detalleVenta: DetalleVenta) {
    this.totalPagar = this.totalPagar - parseFloat(detalleVenta.totalTexto);
    this.listaProductosVenta = this.listaProductosVenta.filter(p => p.idProducto != detalleVenta.idProducto);
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);
  }

  registrarVenta() {
    if(this.listaProductosVenta.length > 0) {
      this.bloquearBotonRegistrar = true;

      const nuevaVenta: Venta = {
        tipoPago: this.tipoPagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosVenta
      }

      this._ventaService.registrar(nuevaVenta).subscribe({
        next: (response) => {
          if(response.status) {
            this.totalPagar = 0.00;
            this.listaProductosVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada',
              text: `Número de Venta: ${ response.value.numeroDocumento }`
            })
          }
          else {
            this._utilityService.mostrarAlerta('No se pudo registrar la venta', 'Cerrar', 'notif-error')
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: (e) => {}
      })
    }
  }

}
