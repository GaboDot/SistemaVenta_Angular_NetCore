using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;
using SistemaVenta.Utilities;

namespace SistemaVenta.BLL.Servicios
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IGenericRepository<Usuario> _usuarioRepositorio;
        private readonly IMapper _mapper;
        string hashed = "";

        public UsuarioService(IGenericRepository<Usuario> usuarioRepositorio, IMapper mapper)
        {
            _usuarioRepositorio = usuarioRepositorio;
            _mapper = mapper;
        }
        public async Task<List<UsuarioDTO>> ListaUsuarios()
        {
            try
            {
                var queryUsuario = await _usuarioRepositorio.Consultar();
                var listaUsuarios = queryUsuario.Include(rol => rol.IdRolNavigation).ToList();
                return _mapper.Map<List<UsuarioDTO>>(listaUsuarios);
            }
            catch (Exception)
            { throw; }
        }

        public async Task<SesionDTO> ValidarCredenciales(string correo, string clave)
        {
            try
            {
                hashed = HashPassword.CreateSHAHash(clave);
                var queryUsuario = await _usuarioRepositorio.Consultar(u =>
                                        u.Correo == correo &&
                                        u.Clave == hashed
                                    );
                if(queryUsuario.FirstOrDefault() == null)
                    throw new TaskCanceledException("El usuario no existe");
                
                Usuario usuario = queryUsuario.Include(rol => rol.IdRolNavigation).First();
                return _mapper.Map<SesionDTO>(usuario);
            }
            catch (Exception)
            { throw; }
        }

        public  async Task<UsuarioDTO> Crear(UsuarioDTO model)
        {
            try
            {
                model.Clave = HashPassword.CreateSHAHash(model.Clave);
                var usuarioCreado = await _usuarioRepositorio.Crear(_mapper.Map<Usuario>(model));
                if(usuarioCreado.IdUsuario ==0)
                    throw new TaskCanceledException("No se pudo crear el usuario");

                var query = await _usuarioRepositorio.Consultar(u => u.IdUsuario == usuarioCreado.IdUsuario);
                usuarioCreado = query.Include(rol => rol.IdRolNavigation).First();
                return _mapper.Map<UsuarioDTO>(usuarioCreado);
            }
            catch (Exception)
            { throw; }
        }

        public async Task<bool> Editar(UsuarioDTO model)
        {
            try
            {
                var usuarioModelo = _mapper.Map<Usuario>(model);
                var usuarioEncontrado = await _usuarioRepositorio.Obtener(u => u.IdUsuario == usuarioModelo.IdUsuario);
                if(usuarioEncontrado == null)
                    throw new TaskCanceledException("No existe el usuario");

                usuarioEncontrado.NombreCompleto = usuarioModelo.NombreCompleto;
                usuarioEncontrado.Correo = usuarioModelo.Correo;
                usuarioEncontrado.IdRol = usuarioModelo.IdRol;
                if(!string.IsNullOrEmpty(usuarioModelo.Clave))
                    usuarioEncontrado.Clave = HashPassword.CreateSHAHash(usuarioModelo.Clave);
                usuarioEncontrado.EsActivo = usuarioModelo.EsActivo;

                bool respuesta = await _usuarioRepositorio.Editar(usuarioEncontrado);
                if(!respuesta)
                    throw new TaskCanceledException("Error al editar el usuario");
                
                return respuesta;
            }
            catch (Exception)
            { throw; }
        }

        public async Task<bool> Eliminar(int idUsuario)
        {
            try
            {
                var usuarioEncontrado = await _usuarioRepositorio.Obtener(u => u.IdUsuario == idUsuario);
                if (usuarioEncontrado == null)
                    throw new TaskCanceledException("No existe el usuario");

                bool respuesta = await _usuarioRepositorio.Eliminar(usuarioEncontrado);
                if (!respuesta)
                    throw new TaskCanceledException("Error al eliminar el usuario");
                
                return respuesta;
            }
            catch (Exception)
            { throw; }
        }
    }
}
