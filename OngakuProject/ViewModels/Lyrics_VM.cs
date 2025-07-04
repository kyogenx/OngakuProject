using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class Lyrics_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Track initial information is required")]
        public int TrackId { get; set; }
        [MaxLength(4000, ErrorMessage = "Max characters qty is restricted on 4000")]
        public string? Content { get; set; }
        [Required(ErrorMessage = "Track main language is required (used for recommendations)")]
        public int LanguageId { get; set; }
        [Required(ErrorMessage = "Track owner only can edit its lyrics")]
        public int UserId { get; set; }
    }
}
