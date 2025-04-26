using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OngakuProject.Models
{
    public class User : IdentityUser<int>
    {
        [MaxLength(75)]
        public string? Nickname { get; set; }
        [MaxLength(15)]
        public string? Searchname { get; set; }
        [MaxLength(2500)]
        public string? Description { get; set; }
        [MaxLength(12)]
        public string? Passcode { get; set; }
        [MaxLength(350)]
        public string? RealName { get; set; }
        [MaxLength(230)]
        public string? Webpage { get; set; }
        public int MonthlyListeners { get; set; }
        public DateTime? LastSeenAt { get; set; }
        public byte WhoCanChat { get; set; } //0 - everyone; 1 - only subscribers; 2 - chosen members; 3 - no one;
        public byte WhoCanDownload { get; set; }
        public byte WhoCanSeeLastSeenInfo { get; set; }
        public bool IsVisible { get; set; } = true;
        [ForeignKey("Country")]
        public int? CountryId { get; set; }
        public Country? Country { get; set; }
        public List<UserImage>? UserImages { get; set; }
        public List<TrackArtist>? TrackArtists { get; set; }
        public List<TrackCredit>? TrackCredits { get; set; }
        public List<Favorite>? Favorites { get; set; }
        public List<TrackHistory>? History { get; set; }
        public List<UserPlaylist>? UserPlaylists { get; set; } = new List<UserPlaylist>();
        [NotMapped]
        public int ImgId { get; set; }
        [NotMapped]
        public string? ImgUrl { get; set; }
    }
}
