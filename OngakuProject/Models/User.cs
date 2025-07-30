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
        [MaxLength(1500)]
        public string? Description { get; set; }
        [MaxLength(12)]
        public string? Passcode { get; set; }
        [MaxLength(350)]
        public string? RealName { get; set; }
        [MaxLength(230)]
        public string? Webpage { get; set; }
        public byte Type { get; set; } //0 - Solo; 1 - DJ, Producer; 2 - Band/Group; 3 - Duos; 4 - Orchestras, 5 - Ensembles; 6 - Choirs; 7 - Collective; 8 - Theatre Artists
        public byte PageDesignPattern { get; set; } //0 - Regular; 1 - With filling image; 2 - blurred filled image with regular avatar inside of it
        public int MonthlyListeners { get; set; }
        public DateTime? LastSeenAt { get; set; }
        public DateTime? FormedAt { get; set; }
        public bool IsOfficial { get; set; }
        public byte WhoCanChat { get; set; } //0 - everyone; 1 - only subscribers; 2 - chosen members; 3 - no one;
        public byte WhoCanDownload { get; set; }
        public byte WhoCanSeeLastSeenInfo { get; set; }
        public bool IsVisible { get; set; } = true;
        [ForeignKey("Genre")]
        public int? GenreId { get; set; }
        [ForeignKey("Country")]
        public int? CountryId { get; set; }
        public Genre? Genre { get; set; }
        public Country? Country { get; set; }
        public List<UserImage>? UserImages { get; set; } = new List<UserImage>();
        public List<TrackArtist>? TrackArtists { get; set; } = new List<TrackArtist>();
        public List<TrackCredit>? TrackCredits { get; set; } = new List<TrackCredit>();
        public List<Playlist>? Playlists { get; set; } = new List<Playlist>();
        public List<Favorite>? Favorites { get; set; } = new List<Favorite>();
        public List<TrackHistory>? History { get; set; } = new List<TrackHistory>();
        public List<UserListener>? UserListeners { get; set; } = new List<UserListener>();
        public List<UserSubscribtion>? UserSubscribtions { get; set; } = new List<UserSubscribtion>();
        public List<UserPlaylist>? UserPlaylists { get; set; } = new List<UserPlaylist>();
        public List<Post>? Posts { get; set; } = new List<Post>();
        public List<RePost>? Reposts { get; set; } = new List<RePost>();
        public List<Poll>? Polls { get; set; } = new List<Poll>();
        public List<PollOptionVote>? PollOptions { get; set; } = new List<PollOptionVote>();

        [NotMapped]
        public int ImgId { get; set; }
        [NotMapped]
        public string? ImgUrl { get; set; }
    }
}
