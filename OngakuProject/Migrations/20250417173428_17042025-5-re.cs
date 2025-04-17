using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _170420255re : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackTracks_Playlists_PlaylistId",
                table: "TrackTracks");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackTracks_Tracks_TrackId",
                table: "TrackTracks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TrackTracks",
                table: "TrackTracks");

            migrationBuilder.RenameTable(
                name: "TrackTracks",
                newName: "TrackPlaylists");

            migrationBuilder.RenameIndex(
                name: "IX_TrackTracks_TrackId",
                table: "TrackPlaylists",
                newName: "IX_TrackPlaylists_TrackId");

            migrationBuilder.RenameIndex(
                name: "IX_TrackTracks_PlaylistId",
                table: "TrackPlaylists",
                newName: "IX_TrackPlaylists_PlaylistId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrackPlaylists",
                table: "TrackPlaylists",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackPlaylists_Playlists_PlaylistId",
                table: "TrackPlaylists",
                column: "PlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrackPlaylists_Tracks_TrackId",
                table: "TrackPlaylists",
                column: "TrackId",
                principalTable: "Tracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackPlaylists_Playlists_PlaylistId",
                table: "TrackPlaylists");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackPlaylists_Tracks_TrackId",
                table: "TrackPlaylists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TrackPlaylists",
                table: "TrackPlaylists");

            migrationBuilder.RenameTable(
                name: "TrackPlaylists",
                newName: "TrackTracks");

            migrationBuilder.RenameIndex(
                name: "IX_TrackPlaylists_TrackId",
                table: "TrackTracks",
                newName: "IX_TrackTracks_TrackId");

            migrationBuilder.RenameIndex(
                name: "IX_TrackPlaylists_PlaylistId",
                table: "TrackTracks",
                newName: "IX_TrackTracks_PlaylistId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrackTracks",
                table: "TrackTracks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackTracks_Playlists_PlaylistId",
                table: "TrackTracks",
                column: "PlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrackTracks_Tracks_TrackId",
                table: "TrackTracks",
                column: "TrackId",
                principalTable: "Tracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
