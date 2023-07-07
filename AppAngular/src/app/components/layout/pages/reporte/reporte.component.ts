import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Reporte } from 'src/app/interfaces/reporte';
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
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})
export class ReporteComponent implements OnInit{

  formularioFiltro: FormGroup;
  listaVentaReporte: Reporte[] = [];
  columnsTable: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource(this.listaVentaReporte);
  @ViewChild(MatPaginator) pagTable!: MatPaginator;
  minFechaFin: any;
  maxFecha: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilityService: UtilityService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.pagTable;
  }

  buscarVentas() {
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value._fechaFin).format('DD/MM/YYYY');

    if(_fechaInicio === 'invalid date' || _fechaFin === 'invalid date') {
      this._utilityService.mostrarAlerta('Las fechas ingresadas son incorrectas', 'Cerrar', 'notif-warning')
      return;
    }

    this._ventaService.reporte(
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (response) => {
        if(response.status) {
          this.listaVentaReporte = response.value;
          this.dataVentaReporte.data = response.value;
        }
        else {
          this.listaVentaReporte = [];
          this.dataVentaReporte.data = [];
          this._utilityService.mostrarAlerta('Sin resultados para la búsqueda', 'Cerrar', 'notif-warning');
        }
      },
      error: (e) => {}
    });
  }

  exportarExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.listaVentaReporte);

    try {
      XLSX.utils.book_append_sheet(wb, ws, `Reporte ${moment(new Date()).format('DD-MM-YYYY')}`);
      XLSX.writeFile(wb, 'Reporte Ventas.xlsx');
    }
    catch(e) {
      this._utilityService.mostrarAlerta('Error en la exportación', 'Cerrar', 'notif-error');
      console.log(e);
    }
  }

  setMinDate(type: string, event: MatDatepickerInputEvent<Date>) {
    if(type == 'change') {
      this.minFechaFin = event.value;
      this.formularioFiltro.value.fechaFin = this.minFechaFin;
      this.formularioFiltro.value.fechaFin.text = this.minFechaFin;
    }
  }
}
