# fantastic-pancake README


npm install -g yo generator-code


# install dependencies for building the extension
npm install -g vsce


# create a .vsix file
vsce package


# install your fantastic extension with:
code --install-extension .\fantastic-pancake-0.0.1.vsix
