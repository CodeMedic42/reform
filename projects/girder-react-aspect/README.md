[![npm version](https://badge.fury.io/js/@reformjs%2Fgirder%2Freact%2Faspect.svg)](https://badge.fury.io/js/@reformjs%2Fgirder%2Freact%2Faspect)
<!-- [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) -->

# Girder React Aspect

Girder React Aspect is a library which defines an Aspect for use in the Girder framework. The Aspect contained within will setup and run a react application instance. Multiple versions of this aspect can be used at a time and because the they each are controlled by Girder they can easily communicate with each other.

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

This project requires [NodeJS](http://nodejs.org/) (version 16 or later), [PNPM](https://https://pnpm.io/).
Please follow their respective installation instructions. To verify if they are installed and available each has a "-v" command option for getting the installed version.

### __Setup__

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/CodeMedic42/reform.git
$ cd girder
```

To install dependencies run this command

```sh
$ pnpm install
```

### __Project Commands__

This project has these high level commands

- build

  To build all project the command "rush build" will run the build command for each project which has changes from the last time this command was ran.

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

The pripmary purpose of this Aspeect is to setup a React app and provide access to Aspects.

#### Setup

Setting up this Aspect is not hard. In fact there are only two steps.

1. Define the Aspect

Defining the Aspect is not hard, just extend from the base ReactAspect. Be sure to give the Aspect a unique name. This name will both uniquely identify this Aspect from the others you register with the Client.

```js
import ReactAspect from '@reformjs/girder-react-aspect/18';
import RootComponent from './components/RootComponent';

class ApplicationAspect extends ReactAspect {
    constructor() {
        super('aspect-name', RootComponent);
    }
}

export default ApplicationAspect;
```

There are two ways React can mount to the dom. The legacy way is to use ReactDom.render. If you are using a version of React 17 and older then you should use @reformjs/girder-react-aspect/17. If you are using a version of React newer then you should use @reformjs/girder-react-aspect/18.

2. Connect it to the client

```js
import Client from '@reformjs/girder';
import ApplicationAspect from './application-aspect';

new Client()
    .registerAspect(new ApplicationAspect())
    .start();
```

#### Result

When this Aspect starts up, it creates a new div in the body element. This div will get an id that has a value which is the name of the Aspect. This div is where the the RootComponent will be mounted. So given then example Aspect above, We'll get some HTML similar to the following.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- Head Contents -->
    </head>
    <body>
        <div id="aspect-name"></div>
    </body>
</html>
```

Be sure to make the Aspect name to also be unique with the ids of all the elements on the page.

#### Multiple React Applications

You can have as many React apps running at a time. Just be sure to give each a unique id.

```js
import ReactAspect from '@reformjs/girder-react-aspect';
import RootComponentA from './components/RootComponentA';
import RootComponentB from './components/RootComponentB';

class ApplicationAspectA extends ReactAspect {
    constructor() {
        super('my-react-app-a', RootComponent);
    }
}

class ApplicationAspectB extends ReactAspect {
    constructor() {
        super('my-react-app-b', RootComponent);
    }
}

new Client()
    .registerAspect(new ApplicationAspectA())
    .registerAspect(new ApplicationAspectB())
    .start();
```

Each Aspect will create it's own div and will mount at that point.

#### Accessing the Client Context

The client context provides access to all the other Aspects which are running in the Client.

There a few ways to gain access to this context.

##### Hooks

There are two hooks which can be used within this system.

- useAspect

The useAspect hook will give access to the controls of a particular Aspect.

```js
import React, { useState, useCallback } from 'react';
import { useAspect, useAction } from '@reformjs/girder-react-aspect';

function MyComponent() {
    const anotherAspect = useAspect('another-aspect-id');

    return null;
}

export default MyComponent;
```

- useAction

The useAction hook takes in an action function and will return a callback function. You can use this to setup separate logic which can be reused. When the callback function is called, the action function will be called and will be passed the following parameters: ClientContext, any additional parameters passed to the callback function.

```js
function myAction(clientContext, paramA, paramB) {
  // You could use the clientContext to access other Aspects.

  const message = `${paramA} ${paramB}`;

  console.log(message); // Will output 'Hello World'
}

function MyComponent() {
  const const myActionCallback = useAction(myAction);

  return (
    <button onClick={() => myActionCallback('Hello', 'World')}>Click Me</button>
  );
}

export default MyComponent;
```

##### Class Context

If you have some React code which is using a class then you can access the the ClientContext one of two ways. You can use the legacy contextType class property or you can use the React context directly.

- contextType

```js
import React, { Component } from 'react';
import { girderReactContext } from '@reformjs/girder-react-aspect';

class IncrementClass extends Component {
    render() {
        const { useAspect, useAction } = this.context;

        const aspect = useAspect('another-aspect-id');

        return null;
    }
}

IncrementClass.contextType = girderReactContext;

export default IncrementClass;
```

- Use React context directly

```js
import React, { Component } from 'react';
import { girderReactContext } from '@reformjs/girder-react-aspect';

class IncrementClass extends Component {
    render() {
        return (
            <girderReactContext.Consumer>
                {(context) => {
                    const { useAspect, useAction } = context;

                    const aspect = useAspect('another-aspect-id');

                    return null;
                }}
            </girderReactContext.Consumer>
        );
    }
}

export default IncrementClass;
```

## __Examples__

A working [example](https://github.com/CodeMedic42/reform/tree/main/examples/girder-react-aspect) on how to setup a React app with the girder system.

## __Versioning__

We use [SemVer](http://semver.org/) for versioning.

## __Authors__

* **[Christian Micle](https://github.com/CodeMedic42)**
   - Initial work

## __Contributors__

See also the list of [contributors](https://github.com/CodeMedic42/reform/graphs/contributors) who participated in this project.

## __License__

[GNU GENERAL PUBLIC LICENSE](https://github.com/CodeMedic42/reform/tree/main/LICENSE.md) © Christian Micle