using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OngakuProject.Migrations
{
    /// <inheritdoc />
    public partial class _27072025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PollId",
                table: "PollOptionVotes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PollOptionVotes_PollId",
                table: "PollOptionVotes",
                column: "PollId");

            migrationBuilder.AddForeignKey(
                name: "FK_PollOptionVotes_Polls_PollId",
                table: "PollOptionVotes",
                column: "PollId",
                principalTable: "Polls",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PollOptionVotes_Polls_PollId",
                table: "PollOptionVotes");

            migrationBuilder.DropIndex(
                name: "IX_PollOptionVotes_PollId",
                table: "PollOptionVotes");

            migrationBuilder.DropColumn(
                name: "PollId",
                table: "PollOptionVotes");
        }
    }
}
