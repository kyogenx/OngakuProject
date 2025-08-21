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
        public DbSet<AlbumTrack> AlbumTracks { get; set; }
        public DbSet<Disc> Discs { get; set; }
        public DbSet<TrackHistory> TrackHistories { get; set; }
        public DbSet<TrackComment> TrackComments { get; set; }
        public DbSet<TrackCommentReaction> TrackCommentsReaction { get; set; }
        public DbSet<TrackRecomment> TrackRecomments { get; set; }
        public DbSet<TrackRecommentReaction> TrackRecommentReactions { get; set; }
        public DbSet<DailyStreamAggregation> DailyStreamAggregations { get; set; }
        public DbSet<Label> Labels { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Lyrics> Lyrics { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<TrackArtist> TrackArtists { get; set; }
        public DbSet<MoodTag> MoodTags { get; set; }
        public DbSet<TrackCredit> TrackCredits { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<TrackPlaylist> TrackPlaylists { get; set; }
        public DbSet<UserPlaylist> UserPlaylists { get; set; }
        public DbSet<UserListener> UserListeners { get; set; }
        public DbSet<UserSubscribtion> UserSubscribtions { get; set; }

        public DbSet<Post> Posts { get; set; }
        public DbSet<RePost> Reposts { get; set; }
        public DbSet<Poll> Polls { get; set; }
        public DbSet<PollOption> PollOptions { get; set; }
        public DbSet<PollOptionVote> PollOptionVotes { get; set; }
        public DbSet<PollLike> PollLikes { get; set; }
        public DbSet<PollComment> PollComments { get; set; }
        public DbSet<PollRecomment> PollRecomments { get; set; }
    }
}
