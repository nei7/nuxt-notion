{
  description = "Dev shell for nuxt-notion";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    let
      forAllSystems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs_24
              pnpm

              typescript-language-server
              vue-language-server
            ];

            shellHook = ''
              echo "Node version: $(node --version)"

              export PATH="$PWD/node_modules/.bin:$PATH"
            '';
          };
        }
      );
    };
}
