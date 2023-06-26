using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;

namespace SistemaVenta.BLL.Servicios
{
    public class ProductoService : IProductoService
    {
        private readonly IGenericRepository<Producto> _productoRepositorio;
        private readonly IMapper _mapper;

        public ProductoService(IGenericRepository<Producto> productoRepositorio, IMapper mapper)
        {
            _productoRepositorio = productoRepositorio;
            _mapper = mapper;
        }

        public async Task<List<ProductoDTO>> ListaProductos()
        {
            try
            {
                var queryProductos = await _productoRepositorio.Consultar();
                var listaProductos = queryProductos.Include(cat => cat.IdCategoriaNavigation).ToList();
                return _mapper.Map<List<ProductoDTO>>(listaProductos);
            }
            catch (Exception exc)
            { throw; }
        }

        public async Task<ProductoDTO> Crear(ProductoDTO model)
        {
            try
            {
                var productoCreado = await _productoRepositorio.Crear(_mapper.Map<Producto>(model));
                if(productoCreado.IdProducto == 0)
                    throw new TaskCanceledException("No se pudo crear el producto");

                return _mapper.Map<ProductoDTO>(productoCreado);
            }
            catch (Exception exc)
            { throw; }
        }

        public async Task<bool> Editar(ProductoDTO model)
        {
            try
            {
                var productoModelo = _mapper.Map<Producto>(model);
                var productoEncontrado = await _productoRepositorio.Obtener(p => p.IdProducto == productoModelo.IdProducto);
                if (productoEncontrado == null)
                    throw new TaskCanceledException("No existe el producto");

                productoEncontrado.Nombre = productoModelo.Nombre;
                productoEncontrado.IdCategoria = productoModelo.IdCategoria;
                productoEncontrado.Stock = productoModelo.Stock;
                productoEncontrado.Precio = productoModelo.Precio;
                productoEncontrado.EsActivo = productoModelo.EsActivo;

                bool respuesta = await _productoRepositorio.Editar(productoEncontrado);
                if (!respuesta)
                    throw new TaskCanceledException("Error al editar el producto");

                return respuesta;
            }
            catch (Exception exc)
            { throw; }
        }

        public async Task<bool> Eliminar(int idProducto)
        {
            try
            {
                var productoEncontrado = await _productoRepositorio.Obtener(p => p.IdProducto== idProducto);
                if (productoEncontrado == null)
                    throw new TaskCanceledException("No existe el producto");
                bool respuesta = await _productoRepositorio.Eliminar(productoEncontrado);
                if (!respuesta)
                    throw new TaskCanceledException("Error al eliminar el producto");

                return respuesta;
            }
            catch (Exception exc)
            { throw; }
        }

    }
}
