import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UtilityService } from 'src/app/reusable/utility.service';
Chart.register(...registerables);



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalIngresos: string = '0';
  totalVentas: string = '0';
  totalProductos: string = '0';

  constructor(
    private _dashboardService: DashboardService,
    private _utilityService: UtilityService,
    private router: Router
  ) {}

  mostrarGrafico(labelsChart: any[], dataChart: any[]) {
    const chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelsChart,
        datasets: [{
          label: '# de Ventas',
          data: dataChart,
          backgroundColor: ['rgba(54, 162, 235, 0.2'],
          borderColor: ['rgba(54, 162, 235, 1'],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnInit(): void {
    const usuario = this._utilityService.obtenerSesionUsuario();
    if(usuario != null) {
      this._dashboardService.resumen().subscribe({
        next: (response) => {
          if(response.status) {
            this.totalIngresos = response.value.totalIngresos;
            this.totalVentas = response.value.totalVentas;
            this.totalProductos = response.value.totalProductos;
  
            const arrayData: any[] = response.value.ventasUltimaSemana;
            const labelTmp = arrayData.map((value) => value.fecha);
            const dataTmp = arrayData.map((value) => value.total);
  
            this.mostrarGrafico(labelTmp, dataTmp);
          }
        },
        error: (e) => {}
      });
    }
    else {
      this._utilityService.eliminarSesion();
      this.router.navigate(['login']);
    }
  }
}
