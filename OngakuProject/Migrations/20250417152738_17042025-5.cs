using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _170420255 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AlbumId",
                table: "UserPlaylists",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPlaylists_AlbumId",
                table: "UserPlaylists",
                column: "AlbumId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPlaylists_Albums_AlbumId",
                table: "UserPlaylists",
                column: "AlbumId",
                principalTable: "Albums",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPlaylists_Albums_AlbumId",
                table: "UserPlaylists");

            migrationBuilder.DropIndex(
                name: "IX_UserPlaylists_AlbumId",
                table: "UserPlaylists");

            migrationBuilder.DropColumn(
                name: "AlbumId",
                table: "UserPlaylists");
        }
    }
}
