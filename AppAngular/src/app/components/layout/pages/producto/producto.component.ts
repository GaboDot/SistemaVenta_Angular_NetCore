import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalProductoComponent } from '../../modals/modal-producto/modal-producto.component';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { UtilityService } from 'src/app/reusable/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {

  columnsTable: string[] = ['nombre', 'categoria', 'stock', 'precio', 'status', 'acciones'];
  dataInicio: Producto[] = [];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) pagTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _productoService: ProductoService,
    private _utilityService: UtilityService
  ) {}

  obtenerProductos() {
    this._productoService.lista().subscribe({
      next: (response) => {
        if(response.status) this.dataListaProductos.data = response.value;
        else this._utilityService.mostrarAlerta('No se encontraron productos.', 'Cerrar');
      },
      error: (e) => {}
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.pagTable;
  }

  aplicarFiltros(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLowerCase();
  }

  nuevoProducto() { 
    this.dialog.open(ModalProductoComponent, {
      disableClose: true
    }).afterClosed().subscribe((result) => {
      if(result === 'true') this.obtenerProductos();
    });
  }

  editarProducto(producto: Producto) { 
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe((result) => {
      if(result === 'true') this.obtenerProductos();
    });
  }

  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: '¿Deseas eliminar el producto?',
      text: producto.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        this._productoService.eliminar(producto.idProducto).subscribe({
          next: (response) => {
            if(response.status) {
              this._utilityService.mostrarAlerta('Se eliminó el usuario', 'Cerrar');
              this.obtenerProductos();
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
