using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class AlbumGenre
    {
        public int Id { get; set; }
        [ForeignKey("Album")]
        public int AlbumId { get; set; }
        [ForeignKey("Genre")]
        public int GenreId { get; set; }
        public Album? Album { get; set; }
        public Genre? Genre { get; set; }
    }
}
