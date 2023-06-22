using SistemaVenta.DAL.DBContext;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.Model;

namespace SistemaVenta.DAL.Repositorios
{
    public class VentaRepository : GenericRepository<Venta>, IVentaRepository
    {
        private readonly DbventaContext dbContext;

        public VentaRepository(DbventaContext dbContext): base(dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Venta> Registrar(Venta modelo)
        {
            Venta ventaGenerada = new Venta();

            using (var transaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    foreach (DetalleVenta dv in modelo.DetalleVenta)
                    {
                        Producto prod_encontrado = dbContext.Productos.Where(p => p.IdProducto == dv.IdProducto).First();
                        prod_encontrado.Stock = prod_encontrado.Stock - dv.Cantidad;
                        dbContext.Productos.Update(prod_encontrado);
                    }
                    await dbContext.SaveChangesAsync();

                    NumeroDocumento numeroDocumento = dbContext.NumeroDocumentos.First();
                    numeroDocumento.UltimoNumero = numeroDocumento.UltimoNumero + 1;
                    numeroDocumento.FechaRegistro = DateTime.Now;
                    dbContext.NumeroDocumentos.Update(numeroDocumento);
                    await dbContext.SaveChangesAsync();

                    int cantidadDigitos = 4;
                    string ceros = string.Concat(Enumerable.Repeat("0", cantidadDigitos));
                    string numeroVenta = ceros + numeroDocumento.UltimoNumero.ToString();
                    numeroVenta = numeroVenta.Substring(numeroVenta.Length - cantidadDigitos, cantidadDigitos);

                    modelo.NumeroDocumento = numeroVenta;

                    await dbContext.Venta.AddAsync(modelo);
                    await dbContext.SaveChangesAsync();

                    ventaGenerada = modelo;

                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }

                return ventaGenerada;
            };
        }
    }
}
