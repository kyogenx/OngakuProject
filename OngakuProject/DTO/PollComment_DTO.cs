using OngakuProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.DTO
{
    public class PollComment_DTO
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public bool IsEdited { get; set; }
        public DateTime SentAt { get; set; }
        public int UserId { get; set; }
        public int? PollId { get; set; }
        public User? User { get; set; }
        public Poll? Poll { get; set; }
        public List<PollRecomment>? PollRecomments { get; set; }
    }
}
