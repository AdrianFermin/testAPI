using System.ComponentModel.DataAnnotations;

namespace test.Models
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = "";

        [Required]
        public string Description { get; set; } = "";

        [Required]
        public int PageCount { get; set; }

        [Required]
        public string excerpt { get; set; } = "";

        public DateTime PublishDate { get; set; }
    }
}
