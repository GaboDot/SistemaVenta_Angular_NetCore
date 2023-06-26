using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SistemaVenta.DAL.DBContext;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DAL.Repositorios;
using SistemaVenta.Utilities;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.BLL.Servicios;

namespace SistemaVenta.IOC
{
    public static class Dependencia
    {
        public static void InyectarDependencias(this IServiceCollection service, IConfiguration config)
        {
            //Dependencia de base de datos
            service.AddDbContext<DbventaContext>(options => {
                options.UseSqlServer(config.GetConnectionString("cadenaSQL"));
            });

            service.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            service.AddScoped<IVentaRepository, VentaRepository>();

            service.AddAutoMapper(typeof(AutoMapperProfile));

            service.AddScoped<IRolService, RolService>();
            service.AddScoped<IUsuarioService, UsuarioService>();
            service.AddScoped<ICategoriasService, CategoriaService>();
            service.AddScoped<IProductoService, ProductoService>();
            service.AddScoped<IVentaService, VentaService>();
            service.AddScoped<IDashboardService, DashboardService>();
            service.AddScoped<IMenuService, MenuService>();
        }
    }
}
