using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EatMeOut.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRestaurantEmailFromCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RestaurantEmail",
                table: "MenuCategories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RestaurantEmail",
                table: "MenuCategories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
