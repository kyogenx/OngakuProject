using OngakuProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OngakuProject.ViewModels
{
    public class Poll_VM
    {
        [Required(ErrorMessage = "Poll must contain some title")]
        [MaxLength(140, ErrorMessage = "Poll's title cannot contain more than 140 chars")]
        public string? Question { get; set; }
        public byte MaxChoicesQty { get; set; } = 1; //Up to 6 (max options qty: 6);
        public int NecessaryVoicesQty { get; set; }
        public int DurationInMinutes { get; set; } = 1440;
        public DateTime CreatedAt { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsAnonym { get; set; }
        public bool IsSkippable { get; set; } //if true show votes without voting; after skipping user cannot vote
        public int? PostId { get; set; }
        [Required(ErrorMessage = "Sign in to create a poll")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "At least two options are necessary")]
        [MinLength(2, ErrorMessage = "That's not democratic to have no choice in a poll")]
        public List<string?>? Options { get; set; } = [];
    }
}
