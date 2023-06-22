using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DAL.DBContext;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace SistemaVenta.DAL.Repositorios
{
    public class GenericRepository<TModel>: IGenericRepository<TModel> where TModel : class
    {
        private readonly DbventaContext dbContext;

        public GenericRepository(DbventaContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<TModel> Obtener(Expression<Func<TModel, bool>> filtro)
        {
            try { 
                return await dbContext.Set<TModel>().FirstOrDefaultAsync(filtro);
            } catch {
                throw;
            }
        }

        public async Task<TModel> Crear(TModel modelo)
        {
            try
            {
                dbContext.Set<TModel>().Add(modelo);
                await dbContext.SaveChangesAsync();
                return modelo;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Editar(TModel modelo)
        {
            try
            {
                dbContext.Set<TModel>().Update(modelo);
                await dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(TModel modelo)
        {
            try
            {
                dbContext.Set<TModel>().Remove(modelo);
                await dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }

        public async Task<IQueryable<TModel>> Consultar(Expression<Func<TModel, bool>> filtro = null)
        {
            try
            {
                IQueryable<TModel> queryModel = filtro == null ? dbContext.Set<TModel>() : dbContext.Set<TModel>().Where(filtro);
                return queryModel;
            }
            catch
            {
                throw;
            }
        }
    }
}
