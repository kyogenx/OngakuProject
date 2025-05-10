using OngakuProject.Models;

namespace OngakuProject.Interfaces
{
    public interface ISearch
    {
        public IQueryable<Playlist>? GetAllPlaylists();
        public IQueryable<Playlist>? SearchForPlaylists(string? Keyword, int Skip, int Load = 25);
    }
}
