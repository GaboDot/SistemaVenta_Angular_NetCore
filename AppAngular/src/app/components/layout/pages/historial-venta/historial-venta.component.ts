import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from 'moment';
import { ModalDetalleVentaComponent } from '../../modals/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from 'src/app/interfaces/venta';
import { VentaService } from 'src/app/services/venta.service';
import { UtilityService } from 'src/app/reusable/utility.service';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    { value: 'fecha', descripcion: 'Por Fechas'},
    { value: 'numero', descripcion: 'Número Venta'},
  ];
  columnsTable: string[] = ['fechaRegistro','numeroDocumento','tipoPago', 'total', 'accion'];
  dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) pagTable!: MatPaginator;
  minFechaFin: any;
  maxFecha: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaService: VentaService,
    private _utilityService: UtilityService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: [new Date()]
    });

    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(value => {
      this.formularioBusqueda.patchValue({
        numero: '',
        fechaInicio: '',
        fechaFin: ''
      });
    })
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.pagTable;
  }

  aplicarFiltros(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLowerCase();
  }

  buscarVentas() {
    let _fechaInicio: string = '';
    let _fechaFin: string = '';

    if(this.formularioBusqueda.value.buscarPor === 'fecha') {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value._fechaFin).format('DD/MM/YYYY');

      if(_fechaInicio === 'invalid date' || _fechaFin === 'invalid date') {
        this._utilityService.mostrarAlerta('Las fechas ingresadas son incorrectas', 'Cerrar', 'notif-warning')
        return;
      }
    }

    this._ventaService.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (response) => {
        if(response.status) this.datosListaVenta = response.value;
        else this._utilityService.mostrarAlerta('Sin resultados para la búsqueda', 'Cerrar', 'notif-warning');
      },
      error: (e) => {}
    });
  }

  verDetalleVenta(_venta: Venta) {
    this.dialog.open(ModalDetalleVentaComponent, {
      data: _venta,
      disableClose: true,
      width: '700px'
    });
  }

  setMinDate(type: string, event: MatDatepickerInputEvent<Date>) {
    if(type == 'change') {
      this.minFechaFin = event.value;
      this.formularioBusqueda.value.fechaFin = this.minFechaFin;
      this.formularioBusqueda.value.fechaFin.text = this.minFechaFin;
    }
  }

}
