using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _020420251 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RealName",
                table: "AspNetUsers",
                type: "nvarchar(350)",
                maxLength: 350,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Webpage",
                table: "AspNetUsers",
                type: "nvarchar(230)",
                maxLength: 230,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RealName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Webpage",
                table: "AspNetUsers");
        }
    }
}
