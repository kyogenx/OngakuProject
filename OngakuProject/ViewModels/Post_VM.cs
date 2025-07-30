using OngakuProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class Post_VM
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Post must contain some content")]
        [MaxLength(2000, ErrorMessage = "Post content must contain less than 2000 chars")]
        public string? Text { get; set; }
        public int MaxRepostsPerUser { get; set; } = 15;
        public bool IsEdited { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsDisabled { get; set; }
        public DateTime CreatedAt { get; set; }

        [Required(ErrorMessage = "You must sign in to create post")]
        public int UserId { get; set; }
        public int? TrackId { get; set; }
        public int? PollId { get; set; }
    }
}
