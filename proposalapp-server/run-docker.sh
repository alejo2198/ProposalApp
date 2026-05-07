docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=PropFlow123!" -p 1433:1433 --name proposalapp-sql -d mcr.microsoft.com/mssql/server:2022-latest
