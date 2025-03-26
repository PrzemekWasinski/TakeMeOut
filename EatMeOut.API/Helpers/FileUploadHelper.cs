using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;

namespace EatMeOut.API.Helpers
{
    public static class FileUploadHelper
    {
        public static async Task<string> SaveFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid image file");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            if (!allowed.Contains(extension))
                throw new Exception("Unsupported file type");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                await File.WriteAllBytesAsync(filePath, memoryStream.ToArray());
            }

            return $"/uploads/{fileName}";

        }

        public static void DeleteFile(string relativePath)
        {
            if (string.IsNullOrEmpty(relativePath))
                return;

            var fileName = relativePath.Replace("/uploads/", "").TrimStart('/');
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", fileName);

            if (File.Exists(filePath))
                File.Delete(filePath);
        }

    }
}

    

