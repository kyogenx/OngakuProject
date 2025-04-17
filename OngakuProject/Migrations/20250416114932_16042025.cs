using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _16042025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackArtists_AspNetUsers_UserId",
                table: "TrackArtists");

            migrationBuilder.DropIndex(
                name: "IX_TrackArtists_UserId",
                table: "TrackArtists");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TrackArtists");

            migrationBuilder.CreateIndex(
                name: "IX_TrackArtists_ArtistId",
                table: "TrackArtists",
                column: "ArtistId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackArtists_AspNetUsers_ArtistId",
                table: "TrackArtists",
                column: "ArtistId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackArtists_AspNetUsers_ArtistId",
                table: "TrackArtists");

            migrationBuilder.DropIndex(
                name: "IX_TrackArtists_ArtistId",
                table: "TrackArtists");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "TrackArtists",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrackArtists_UserId",
                table: "TrackArtists",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackArtists_AspNetUsers_UserId",
                table: "TrackArtists",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
