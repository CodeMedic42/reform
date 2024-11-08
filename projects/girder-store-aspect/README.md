[![npm version](https://badge.fury.io/js/@reformjs%2Fgirder%2Fstore%2Faspect.svg)](https://badge.fury.io/js/@reformjs%2Fgirder%2Fstore%2Faspect)
<!-- [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) -->

# Girder Store Aspect

Girder Store Aspect is a framework built to work within the Girder system. It provides multiple different aspects for connecting to different store frameworks.


## __Table of contents__

- [Girder](#girder)
  - [Table of contents](#table-of-contents)
  - [Contribution](#contribution)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Project Commands](#project-commands)
  - [Usage](#usage)
    - [Installation](#installation)
    - [Overview](#overview)
      - [Client](#client)
      - [Aspect](#aspect)
  - [Examples](#examples)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [Contributors](#contributors)
  - [License](#license)

## __Contribution__

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. For instructions on how to use this system within another project please see the [Installation](#installation) section.

### __Prerequisites__

This project requires [NodeJS](http://nodejs.org/) (version 20 or later), [PNPM](https://https://pnpm.io/).
Please follow their respective installation instructions. To verify if they are installed and available each has a "-v" command option for getting the installed version.

### __Setup__

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/CodeMedic42/reform.git
$ cd girder-react-store
```

To install dependencies run this command

```sh
$ pnpm install
```

### __Project Commands__

This project has these high level commands

- build

  To build all project the command "rush build" will run the build command for each project which has changes from the last time this command was ran.

- deploy

  To build and publish a new version the command "rush deploy" will perform a build and will deploy the latest version of the changes for those projects who have changes.

- test

  To run the unit tests the command "rush test" will run the test system. (Note: There are no tests at this time)

- lint

To run the linting rules the command "rush list" will run the linting system. (Note: There are is no command at this time)

## __Usage__

These instructions will help you install this library to your project and provide assistance on how to use it. For information on how to contribute to this project please see the [Contribution](#contribution) section

### __Installation__

To install and set up the library, run:

- npm

  ```sh
  $ npm install girder
  ```

- yarn

  ```sh
  $ yarn add girder
  ```

- pnpm

  ```sh
  $ pnpm install girder
  ```

### __Overview__





## __Examples__

A working [example](https://github.com/CodeMedic42/reform/tree/main/examples/girder) on how to setup girder and create some basic Aspects has been provided.

## __Versioning__

We use [SemVer](http://semver.org/) for versioning.

## __Authors__

* **[Christian Micle](https://github.com/CodeMedic42)**
   - Initial work

## __Contributors__

See also the list of [contributors](https://github.com/CodeMedic42/reform/graphs/contributors) who participated in this project.

## __License__

[MIT License](https://andreasonny.mit-license.org/2019) © Christian Micle