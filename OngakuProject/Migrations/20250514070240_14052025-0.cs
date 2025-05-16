using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _140520250 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsListened",
                table: "TrackHistories",
                newName: "IsValid");

            migrationBuilder.AddColumn<byte>(
                name: "DeviceType",
                table: "TrackHistories",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<int>(
                name: "Duration",
                table: "TrackHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeviceType",
                table: "TrackHistories");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "TrackHistories");

            migrationBuilder.RenameColumn(
                name: "IsValid",
                table: "TrackHistories",
                newName: "IsListened");
        }
    }
}
