using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _170420254re : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PinOrder",
                table: "Playlists");

            migrationBuilder.AddColumn<byte>(
                name: "PinOrder",
                table: "UserPlaylists",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PinOrder",
                table: "UserPlaylists");

            migrationBuilder.AddColumn<byte>(
                name: "PinOrder",
                table: "Playlists",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);
        }
    }
}
