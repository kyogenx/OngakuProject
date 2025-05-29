using OngakuProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class LyricSync_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Choose correct timestamp for this part")]
        public TimeSpan[]? Timestamps { get; set; }
        [Required(ErrorMessage = "Enter content for this timestamp")]
        public string?[]? Lines { get; set; }
        public int LyricsId { get; set; }
        [Required(ErrorMessage = "Track information is required for this type of action")]
        public int TrackId { get; set; }
        [Required(ErrorMessage = "User information is required")]
        public int UserId { get; set; }
    }
}
