using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _21042025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Language",
                table: "Lyrics");

            migrationBuilder.AddColumn<int>(
                name: "LanguageId",
                table: "Lyrics",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Languages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LanguageCode = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Languages", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lyrics_LanguageId",
                table: "Lyrics",
                column: "LanguageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lyrics_Languages_LanguageId",
                table: "Lyrics",
                column: "LanguageId",
                principalTable: "Languages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lyrics_Languages_LanguageId",
                table: "Lyrics");

            migrationBuilder.DropTable(
                name: "Languages");

            migrationBuilder.DropIndex(
                name: "IX_Lyrics_LanguageId",
                table: "Lyrics");

            migrationBuilder.DropColumn(
                name: "LanguageId",
                table: "Lyrics");

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Lyrics",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
