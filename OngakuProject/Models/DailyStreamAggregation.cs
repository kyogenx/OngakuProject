using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class DailyStreamAggregation
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public int Streams { get; set; }
        public int UniqueListeners { get; set; }
        public int TotalDuration { get; set; } //in seconds
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
