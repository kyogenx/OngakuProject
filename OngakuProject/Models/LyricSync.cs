using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class LyricSync
    {
        public int Id { get; set; }
        public TimeSpan TimestampSec { get; set; }
        [MaxLength(250)]
        public string? WordLineContent { get; set; }
    }
}
