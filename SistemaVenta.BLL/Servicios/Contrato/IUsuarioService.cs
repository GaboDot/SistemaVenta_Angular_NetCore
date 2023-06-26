using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IUsuarioService
    {
        Task<List<UsuarioDTO>> ListaUsuarios();

        Task<SesionDTO> ValidarCredenciales(string correo, string clave);

        Task<UsuarioDTO> Crear(UsuarioDTO model);

        Task<bool> Editar(UsuarioDTO model);

        Task<bool> Eliminar(int idUsuario);
    }
}
