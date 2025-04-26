using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _240420250 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TrackId",
                table: "Lyrics",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lyrics_TrackId",
                table: "Lyrics",
                column: "TrackId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lyrics_Tracks_TrackId",
                table: "Lyrics",
                column: "TrackId",
                principalTable: "Tracks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lyrics_Tracks_TrackId",
                table: "Lyrics");

            migrationBuilder.DropIndex(
                name: "IX_Lyrics_TrackId",
                table: "Lyrics");

            migrationBuilder.DropColumn(
                name: "TrackId",
                table: "Lyrics");
        }
    }
}
