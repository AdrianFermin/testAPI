using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using test.Models;

namespace test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public BooksController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri("https://fakerestapi.azurewebsites.net");
        }

        // GET /api/Books
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            HttpResponseMessage response = await _httpClient.GetAsync("/api/v1/Books");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var books = JsonConvert.DeserializeObject<List<Book>>(content);
                return Ok(books);
            }

            return StatusCode((int)response.StatusCode, "Error al obtener los libros");
        }

        // GET /api/Books/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            HttpResponseMessage response = await _httpClient.GetAsync($"/api/v1/Books/{id}");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var book = JsonConvert.DeserializeObject<Book>(content);
                return Ok(book);
            }

            return StatusCode((int)response.StatusCode, $"Error al obtener el libro con ID {id}");
        }

        // POST /api/Books
        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] Book book)
        {
            var json = JsonConvert.SerializeObject(book);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            HttpResponseMessage response = await _httpClient.PostAsync("/api/v1/Books", content);

            if (response.IsSuccessStatusCode)
            {
                return Ok("Libro creado con éxito");
            }

            return StatusCode((int)response.StatusCode, "Error al crear el libro");
        }

        // PUT /api/Books/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
        {
            var json = JsonConvert.SerializeObject(book);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            HttpResponseMessage response = await _httpClient.PutAsync($"/api/v1/Books/{id}", content);

            if (response.IsSuccessStatusCode)
            {
                return Ok($"{json} \nLibro actualizado con éxito");
            }

            return StatusCode((int)response.StatusCode, $"Error al actualizar el libro con ID {id}");
        }

        // DELETE /api/Books/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            HttpResponseMessage response = await _httpClient.DeleteAsync($"/api/v1/Books/{id}");

            if (response.IsSuccessStatusCode)
            {
                return Ok("Libro eliminado con éxito");
            }

            return StatusCode((int)response.StatusCode, $"Error al eliminar el libro con ID {id}");
        }
    }
}
