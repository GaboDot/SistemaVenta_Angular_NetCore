using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;
using System.Globalization;

namespace SistemaVenta.BLL.Servicios
{
    public class VentaService: IVentaService
    {
        private readonly IVentaRepository _ventaRepository;
        private readonly IGenericRepository<DetalleVenta> _detalleVentaRepositorio;
        private readonly IMapper _mapper;

        public VentaService(IVentaRepository ventaRepository, IGenericRepository<DetalleVenta> detalleVentaRepositorio, IMapper mapper)
        {
            _ventaRepository = ventaRepository;
            _detalleVentaRepositorio = detalleVentaRepositorio;
            _mapper = mapper;
        }

        public async Task<VentaDTO> RegistrarVenta(VentaDTO model)
        {
            try
            {
                var ventaGenerada = await _ventaRepository.Registrar(_mapper.Map<Venta>(model));
                if( ventaGenerada.IdVenta == 0)
                    throw new TaskCanceledException("No se pudo registrar la venta");

                return _mapper.Map<VentaDTO>(ventaGenerada);
            }
            catch (Exception)
            { throw; }
        }

        public async Task<List<VentaDTO>> Historial(string buscarPor, string numeroVenta, string fechaInicio, string fechaFin)
        {
            IQueryable<Venta> query = await _ventaRepository.Consultar();
            var listaResultado = new List<Venta>();

            try
            {
                if(buscarPor == "fecha")
                {
                    DateTime fecha_Ini = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-MX"));
                    DateTime fecha_Fin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-MX"));

                    listaResultado = await query.Where(v =>
                                        v.FechaRegistro.Value.Date >= fecha_Ini.Date &&
                                        v.FechaRegistro.Value.Date <= fecha_Fin.Date)
                                    .Include(dv => dv.DetalleVenta)
                                    .ThenInclude(p => p.IdProductoNavigation)
                                    .ToListAsync();


                }
                else
                {
                    listaResultado = await query.Where(v => v.NumeroDocumento == numeroVenta)
                                    .Include(dv => dv.DetalleVenta)
                                    .ThenInclude(p => p.IdProductoNavigation)
                                    .ToListAsync();
                }

                return _mapper.Map<List<VentaDTO>>(listaResultado);
            }
            catch (Exception)
            { throw; }
        }

        public async Task<List<ReporteDTO>> Reporte(string fechaInicio, string fechaFin)
        {
            IQueryable<DetalleVenta> query = await _detalleVentaRepositorio.Consultar();
            var listaResultado = new List<DetalleVenta>();

            try
            {
                DateTime fecha_Ini = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-MX"));
                DateTime fecha_Fin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-MX"));

                listaResultado = await query
                                   .Include(p => p.IdProductoNavigation)
                                   .Include(dv => dv.IdVentaNavigation)
                                   .Where(dv =>
                                        dv.IdVentaNavigation.FechaRegistro.Value.Date >= fecha_Ini.Date &&
                                        dv.IdVentaNavigation.FechaRegistro.Value.Date <= fecha_Fin.Date
                                   ).ToListAsync();

                return _mapper.Map<List<ReporteDTO>>(listaResultado);
            }
            catch (Exception)
            { throw; }
        }
    }
}
