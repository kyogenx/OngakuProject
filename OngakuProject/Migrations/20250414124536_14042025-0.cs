using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _140420250 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackArtist_AspNetUsers_UserId",
                table: "TrackArtist");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackArtist_Tracks_TrackId",
                table: "TrackArtist");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TrackArtist",
                table: "TrackArtist");

            migrationBuilder.RenameTable(
                name: "TrackArtist",
                newName: "TrackArtists");

            migrationBuilder.RenameIndex(
                name: "IX_TrackArtist_UserId",
                table: "TrackArtists",
                newName: "IX_TrackArtists_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_TrackArtist_TrackId",
                table: "TrackArtists",
                newName: "IX_TrackArtists_TrackId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrackArtists",
                table: "TrackArtists",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackArtists_AspNetUsers_UserId",
                table: "TrackArtists",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackArtists_Tracks_TrackId",
                table: "TrackArtists",
                column: "TrackId",
                principalTable: "Tracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackArtists_AspNetUsers_UserId",
                table: "TrackArtists");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackArtists_Tracks_TrackId",
                table: "TrackArtists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TrackArtists",
                table: "TrackArtists");

            migrationBuilder.RenameTable(
                name: "TrackArtists",
                newName: "TrackArtist");

            migrationBuilder.RenameIndex(
                name: "IX_TrackArtists_UserId",
                table: "TrackArtist",
                newName: "IX_TrackArtist_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_TrackArtists_TrackId",
                table: "TrackArtist",
                newName: "IX_TrackArtist_TrackId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrackArtist",
                table: "TrackArtist",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackArtist_AspNetUsers_UserId",
                table: "TrackArtist",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackArtist_Tracks_TrackId",
                table: "TrackArtist",
                column: "TrackId",
                principalTable: "Tracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
