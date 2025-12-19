{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs_24
    pkgs.pnpm

    typescript-language-server
    vue-language-server
  ];

  shellHook = ''
    echo "Node version: $(node --version)"

    export PATH="$PWD/node_modules/.bin:$PATH"
  '';
}
