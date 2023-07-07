using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.Utilities
{
    public class HashPassword
    {
        public static string CreateSHAHash(string Phrase)
        {
            SHA512 HashTool = new SHA512Managed();
            Byte[] PhraseAsByte = System.Text.Encoding.UTF8.GetBytes(string.Concat(Phrase));
            Byte[] EncryptedBytes = HashTool.ComputeHash(PhraseAsByte);
            HashTool.Clear();
            return Convert.ToBase64String(EncryptedBytes);
        }
    }
}
