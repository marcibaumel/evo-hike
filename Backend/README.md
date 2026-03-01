build:
	cd evoHike.Backend && dotnet build

test:
	cd evoHike.UnitTests && dotnet test

run:
	cd evoHike.Backend && dotnet run

debug:
	cd evoHike.Backend && dotnet run --configuration Debug

clean:
	cd evoHike.Backend && dotnet clean
	cd evoHike.UnitTests && dotnet clean
	rm -rf evoHike.Backend/bin evoHike.Backend/obj
	rm -rf evoHike.UnitTests/bin evoHike.UnitTests/obj

restore:
	cd evoHike.Backend && dotnet restore
	cd evoHike.UnitTests && dotnet restore
