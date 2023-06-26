using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IRolService
    {
        Task<List<RolDTO>> Lista();
    }
}
