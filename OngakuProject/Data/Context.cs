using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Models;

namespace OngakuProject.Data
{
    public class Context : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public Context(DbContextOptions<Context> Options) : base(Options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<UserImage> UserImages { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Track> Tracks { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<Disc> Discs { get; set; }
        public DbSet<TrackHistory> TrackHistories { get; set; }
        public DbSet<DailyStreamAggregation> DailyStreamAggregations { get; set; }
        public DbSet<Label> Labels { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Lyrics> Lyrics { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<TrackArtist> TrackArtists { get; set; }
        public DbSet<MoodTag> MoodTags { get; set; }
        public DbSet<TrackCredit> TrackCredits { get; set; }
        public DbSet<AlbumGenre> AlbumGenres { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<TrackPlaylist> TrackPlaylists { get; set; }
        public DbSet<UserPlaylist> UserPlaylists { get; set; }
        public DbSet<UserListener> UserListeners { get; set; }
        public DbSet<UserSubscribtion> UserSubscribtions { get; set; }
    }
}
