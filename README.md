# MD-Contents

## Install

This package is not formally registered with npm.  To install:

1. Download the released tarball for this repository - [md-contents-1.1.2.tar.gz](https://github.com/thepeej-pwhite6/md-contents/archive/v1.2.0.tar.gz).
1. From the location of the downloaded tarball, execute the following from a command line:

```{shell}
$ npm install -g md-contents-1.2.0.tar.gz
```

## Usage

To add a contents section to an existing MarkDown document, execute the following from a command line:


```{shell}
$ md-contents [filename] add
```

To remove a contents section from an existing MarkDown document, execute the following from a command line:


```{shell}
$ md-contents [filename] remove
```

To add a contents section to an existing MarkDown document and navigation aids to subsections, execute the following from a command line:


```{shell}
$ md-contents [filename] add -n
```

To remove a contents section and navigation aids from an existing MarkDown document, execute the following from a command line:


```{shell}
$ md-contents [filename] remove -n
```

:notebook: There is no ability to update the contents already added to a MarkDown document using this utility.  As a workaround, remove the existing contents and add again using the procedures above.


## Known Issues

If you get the following error when executing md-contents from a command line in a Windows environment, try adding the path to your main npm installation as an environment variable called `NODE_PATH`.


```{shell}
internal/modules/cjs/loader.js:979
  throw err;
  ^

Error: Cannot find module 'md-2-json'
```

:notebook: The path to you main npm installation is typically `C:\Users\\[user name]\AppData\Roaming\npm\node_modules`.
