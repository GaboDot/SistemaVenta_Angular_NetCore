using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface ICategoriasService
    {
        Task<List<CategoriaDTO>> Lista();
    }
}
