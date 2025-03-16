using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _140320250 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserImage_AspNetUsers_UserId",
                table: "UserImage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserImage",
                table: "UserImage");

            migrationBuilder.RenameTable(
                name: "UserImage",
                newName: "UserImages");

            migrationBuilder.RenameIndex(
                name: "IX_UserImage_UserId",
                table: "UserImages",
                newName: "IX_UserImages_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserImages",
                table: "UserImages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserImages_AspNetUsers_UserId",
                table: "UserImages",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserImages_AspNetUsers_UserId",
                table: "UserImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserImages",
                table: "UserImages");

            migrationBuilder.RenameTable(
                name: "UserImages",
                newName: "UserImage");

            migrationBuilder.RenameIndex(
                name: "IX_UserImages_UserId",
                table: "UserImage",
                newName: "IX_UserImage_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserImage",
                table: "UserImage",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserImage_AspNetUsers_UserId",
                table: "UserImage",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
