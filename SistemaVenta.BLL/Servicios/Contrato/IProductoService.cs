using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IProductoService
    {
        Task<List<ProductoDTO>> ListaProductos();

        Task<ProductoDTO> Crear(ProductoDTO model);

        Task<bool> Editar(ProductoDTO model);

        Task<bool> Eliminar(int idProducto);
    }
}
