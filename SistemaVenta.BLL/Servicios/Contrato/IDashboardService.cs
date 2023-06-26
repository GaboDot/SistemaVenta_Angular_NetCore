using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IDashboardService
    {
        Task<DashboardDTO> Resumen();
    }
}
