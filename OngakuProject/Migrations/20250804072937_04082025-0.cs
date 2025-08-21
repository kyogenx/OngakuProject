using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _040820250 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PollLike_AspNetUsers_UserId",
                table: "PollLike");

            migrationBuilder.DropForeignKey(
                name: "FK_PollLike_Polls_PollId",
                table: "PollLike");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PollLike",
                table: "PollLike");

            migrationBuilder.RenameTable(
                name: "PollLike",
                newName: "PollLikes");

            migrationBuilder.RenameIndex(
                name: "IX_PollLike_UserId",
                table: "PollLikes",
                newName: "IX_PollLikes_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PollLike_PollId",
                table: "PollLikes",
                newName: "IX_PollLikes_PollId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PollLikes",
                table: "PollLikes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PollLikes_AspNetUsers_UserId",
                table: "PollLikes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PollLikes_Polls_PollId",
                table: "PollLikes",
                column: "PollId",
                principalTable: "Polls",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PollLikes_AspNetUsers_UserId",
                table: "PollLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_PollLikes_Polls_PollId",
                table: "PollLikes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PollLikes",
                table: "PollLikes");

            migrationBuilder.RenameTable(
                name: "PollLikes",
                newName: "PollLike");

            migrationBuilder.RenameIndex(
                name: "IX_PollLikes_UserId",
                table: "PollLike",
                newName: "IX_PollLike_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_PollLikes_PollId",
                table: "PollLike",
                newName: "IX_PollLike_PollId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PollLike",
                table: "PollLike",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PollLike_AspNetUsers_UserId",
                table: "PollLike",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PollLike_Polls_PollId",
                table: "PollLike",
                column: "PollId",
                principalTable: "Polls",
                principalColumn: "Id");
        }
    }
}
