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
        public DbSet<Label> Labels { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Lyrics> Lyrics { get; set; }
        public DbSet<MoodTag> MoodTags { get; set; }
        public DbSet<TrackGenre> TrackGenres { get; set; }
        public DbSet<TrackMood> TrackMoods { get; set; }
        public DbSet<TrackCredit> TrackCredits { get; set; }
        public DbSet<AlbumGenre> AlbumGenres { get; set; }
    }
}
