using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class Disc : Base
    {
        [MaxLength(150)]
        public string? Name { get; set; }
        [ForeignKey("Album")]
        public int AlbumId { get; set; }
        public Album? Album { get; set; }
    }
}
