using OngakuProject.Models;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.DTO
{
    public class PollRecomment_DTO
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public bool IsEdited { get; set; }
        public DateTime SentAt { get; set; }
        public int UserId { get; set; }
        public int? PollCommentId { get; set; }
        public User? User { get; set; }
        public PollComment? PollComment { get; set; }
    }
}
