namespace SistemaVenta.API.Utilites
{
    public class Response<T>
    {
        public bool status { get; set; }

        public T value { get; set; }

        public string message { get; set; }
    }
}
