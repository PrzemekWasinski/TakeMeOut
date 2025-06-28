# Take Me Out 
Take Me Out is a restaurant delivery system where users can login/register search for restaurants near them, sort by food type, menu items, location etc. order, see live updates for their order and rate restaurnats. Restaurant owners can register their restaurant, see their daily revenue, rating, orders etc, update customer's orders, add/remove/edit their menu, items, restaurant info and more.

Home Page:
<img width="940" alt="home" src="https://github.com/user-attachments/assets/81e04f73-8856-44a4-a7e3-56f5391ebd23" />

Restaurant Owner's dashboard:
<img width="940" alt="dash-new" src="https://github.com/user-attachments/assets/f28d53bd-d898-47c6-92e6-85c23d0f458c" />

# Tech stack

    Frontend: Vanilla Javascript, Tailwind CSS
    Backend: .NET Framework
    Database: Microsoft SQL

# How to run

Before being able to run this project, the following tools need to be installed on your system:

        .NET 8.0
        Microsoft SQL Server Management Studio (SSMS)

First install the required packages by running the following commands in `src/TakeMeOut.API`:

    dotnet add package Microsoft.EntityFrameworkCore.SqlServer
    dotnet add package Microsoft.EntityFrameworkCore.Tools
    dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
    dotnet add package Swashbuckle.AspNetCore
    dotnet add package Microsoft.EntityFrameworkCore.Design
    dotnet add package Microsoft.AspNetCore.Cors

Then connect to your SQL Server using `SSMS` and modify the `DefaultConnection` String in `/src/TakeMeOut.API/appsettings.json` 

Run the following commands in `/src/TakeMeOut.API`
    
    dotnet ef migrations add InitialCreate (If this doesn't work, or the migration already exists, delete everything INSIDE TakeMeOut.API/Migrations. )
    dotnet ef database update
    dotnet build
    dotnet run

Run the following command in in `src/frontend:`

    npx http-server -p 

Naviagte to `http://127.0.0.1:8080` in your browser and enjoy!
