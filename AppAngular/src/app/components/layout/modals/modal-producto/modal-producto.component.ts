import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { Producto } from 'src/app/interfaces/producto';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UtilityService } from 'src/app/reusable/utility.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {
  
  formularioProducto: FormGroup;
  tituloModal: string = 'Agregar';
  botonModal: string = 'Guardar';
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoriaService: CategoriaService,
    private _productoService: ProductoService,
    private _utilityService: UtilityService
  ) {
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });

    if(this.datosProducto != null) {
      this.tituloModal = 'Editar';
      this.botonModal = 'Actualizar';
    }

    this._categoriaService.lista().subscribe({
      next: (response) => {
        if(response.status) this.listaCategorias = response.value;
      },
      error: (e) => {}
    });

  }

  ngOnInit(): void {
    if(this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  guardarEditarProducto() {
    
    const _producto: Producto = {
      idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria: '',
      stock: this.formularioProducto.value.stock,
      precio: this.formularioProducto.value.precio,
      esActivo: parseInt(this.formularioProducto.value.esActivo)
    };

    if(this.datosProducto == null) {
      this._productoService.guardar(_producto).subscribe({
        next: (response) => {
          if(response.status) {
            this._utilityService.mostrarAlerta('El producto se registró correctamente', 'Cerrar', 'notif-success');
            this.modalActual.close('true');
          }
          else {
            this._utilityService.mostrarAlerta('No se pudo registrar el producto', 'Cerrar', 'notif-error');
          }
        },
        error: (e) => {}
      });
    }
    else {
      this._productoService.editar(_producto).subscribe({
        next: (response) => {
          if(response.status) {
            this._utilityService.mostrarAlerta('El producto se actualizó correctamente', 'Cerrar', 'notif-success');
            this.modalActual.close('true');
          }
          else {
            this._utilityService.mostrarAlerta('No se pudo actualizar el producto', 'Cerrar', 'notif-error');
          }
        },
        error: (e) => {}
      });
    }
  }
}
