using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class InitialRe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Searchname",
                table: "AspNetUsers",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Searchname",
                table: "AspNetUsers");
        }
    }
}
