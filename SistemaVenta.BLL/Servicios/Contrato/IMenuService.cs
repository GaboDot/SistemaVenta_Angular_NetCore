using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IMenuService
    {
        Task<List<MenuDTO>> ObtenerMenu(int idUsuario);
    }
}
