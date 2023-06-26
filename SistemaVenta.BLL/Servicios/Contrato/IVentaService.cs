using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IVentaService
    {
        Task<VentaDTO> RegistrarVenta(VentaDTO model);

        Task<List<VentaDTO>> Historial(string buscarPor, string numeroVenta, string fechaInicio, string fechaFin);
        
        Task<List<ReporteDTO>> Reporte(string fechaInicio, string fechaFin);
    }
}
