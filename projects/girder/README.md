[![npm version](https://badge.fury.io/js/@reformjs%2Fgirder.svg)](https://badge.fury.io/js/@reformjs%2Fgirder)
<!-- [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) -->

# Girder

Girder is a framework built to compartmentalize common setup steps for any front end Javascript application. It is structured around the idea that any application is just a series of plugins, even the application itself. Each plugin in this context is called an Aspect, as that plugin is just an aspect of the application.


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

There are only two primary parts to this system, the Client and the Aspect. Both are the building blocks to an application which is compartmentalized and flexible. The next two sections will provide information on both, and how to take advantage of their functionality.

  1. ### Client

      The client is the root of your application it runs the show but needs very little. To get started with it all you need to do is import it and create an instance of it.

      ```js
      import Client from '@reformjs/girder';

      const client = new Client();
      ```

      However the client is really nothing more than a startup workflow implementation. Its the [Aspects](#aspect) which really do the work. We'll get to them in a minute. First we need to know how to add them to the client. Let's take a look at that.

      ```js
      client.registerAspect(YOUR_ASPECT_HERE);
      ```

      You can register as many different aspects as you want. However as we will see, each Aspect has a unique id, and all registered Aspect Ids must be unique.

      Once you have registered all your Aspects all that is needed is to start the client. This will start the process of setting up and executing the logic inside each Aspect.

      ```js
      client.start();
      ```

      The start method will return a promise which when resolved will indicate that all Aspects have completely started.

      If however you want to stop the client all that you need to do is the following.

      ```js
      client.stop();
      ```

      The stop method will return a promise which when resolved will indicate that all Aspects have completely stopped.

      That is all it takes, but we can shorten all this down like this.

      ```js
      import Client from '@reformjs/girder';

      const client = new Client()
        .registerAspect(YOUR_ASPECT_HERE)
        .registerAspect(YOUR_ASPECT_HERE)
        .registerAspect(YOUR_ASPECT_HERE)
        .start();
      ```

  1. ### Aspect

      The Aspect is the brains behind the Client.

      An Aspect can be created via following

      ```js
      import { Aspect } = "@reformjs/girder";

      const aspect = new Aspect('YOUR_ASPECT_ID');
      ```

      All an aspect requires is an ID as the first parameter to the constructor.

      However this Aspect is not going to do anything. We need to extend from it to take advantage of it's functionality.

      ```js
      import { Aspect } = "@reformjs/girder";

      class MyAspect extends Aspect {
        // ... overrides
      }
      ```

      However if you have logic you would like to run as part of the constructor be sure to either default the Aspect Id or allow whoever uses your Aspect to provide it.

      ```js
      import { Aspect } = "@reformjs/girder";

      class MyAspect extends Aspect {
        constructor(aspectId) {
          super(aspectId);
        }

        // ... overrides
      }
      ```

      ```js
      import { Aspect } = "@reformjs/girder";

      class MyAspect extends Aspect {
        constructor() {
          super('MY_STATIC_ID');
        }

        // ... overrides
      }
      ```

      __Note:__ There are a series of methods which can be overridden which are called as part of the client startup and stopping workflows. We will go over these methods shortly. If extending directly from the Aspect you do not need to call the super instance of these methods. However if extending from a predefined Aspect from another library or a custom one then the super instance should be called. Further examples will illustrate this even though they are extending from the base Aspect. Failure to do so might prevent the system from fully starting up.

      ### - __`settings`__

      The method, settings, is synchronous, can be overridden, and is called as the client is starting up. The purpose of this method is to provide setup configuration to other Aspects as they are starting up. It takes no parameters and expects an object to be returned. We will get to how the Aspect accesses this information in a moment.

      For an example let's assume we have an Aspect like so...

      ```js
      import { Aspect } = "@reformjs/girder";

      class MyAspect extends Aspect {
        constructor() {
          super('MY_STATIC_ID');
        }

        // ... overrides
      }
      ```

      Let's assume the above Aspect has configuration information it uses.

      To pass this information in from another Aspect we would do this.

      ```js
      import { Aspect } = "@reformjs/girder";

      class MyOtherAspect extends Aspect {
        constructor() {
          super('MY_OTHER_STATIC_ID');
        }

        settings() {
          return {
            MY_STATIC_ID: {} // Here is the configuration information.
          };
        }

        // ... overrides
      }
      ```

      The settings method expects an object to be returned where each property key is the id of the Aspect you want to pass information to. You are not obligated to override or use this method or even pass information to all aspects. Only provide information to those Aspects you want to. The information passed can be any data type.

      #### - __`onInitialize`__

      The method, onInitialize, is asynchronous, can be overridden, and is called as the client is starting up. The purpose of this method is to setup and run any prelaunch logic.

      - Return Value

        Before we get to the parameters provided to this method we first need to talk about what can be returned from it and how that information is used.

        The return value can generally be anything. If it is a promise then the Client will wait for this and any other Aspects to complete their initialization before starting the system fully. What's important is what happens to the information you return directly or through a promise. Inside the client when it is started as each onInitialize method is called, their return values, if not nil, are place in an object called the clientContext under a key matching the id of the Aspect. As an example given the MyAspect example above, if it were to return something like this...

        ```js
        import { Aspect } = "@reformjs/girder";

        class MyAspect extends Aspect {
            constructor() {
                super('MY_STATIC_ID');
            }

            onInitialize(config) {
                return {
                    startInterval: (cb, delay, ...args) => {
                        this.interval = setInterval(cb, delay, ...args);
                    },
                    clearInterval: () => {
                        clearInterval(this.interval);
                    }
                };
            }

            // ... overrides
        }
        ```

        Then the clientContext would result in something like this.

        ```js
        {
            MY_STATIC_ID: {
                startInterval,
                clearInterval,
            }
        }
        ```

        For the rest of this document the return value from this method will be referred to as the Aspect control.

      - Parameters

        The onInitialize method is passed one object called the configuration. The configuration provides two properties.

        - getSettings

          This will be a function which when called with the settingID, will return an array of all configuration data provided by setting ids from other Aspects. It will be up to the running Aspect to combine that data together. An Aspect should not require any order to the settings as no guarantee can be given on the order of how Aspects are registered.

          ```js
          import { Aspect } = "@reformjs/girder";

          class MyOtherAspect extends Aspect {
            constructor() {
              super('MY_OTHER_STATIC_ID');
            }

            onInitialize(config) {
              const { getSettings } = config;

              // Do what you will with the provided settings.
            }

            // ... overrides
          }
          ```

        - getContext

          This is a function which will, when called, return the clientContext providing access to all the Aspect controls. Be aware that the clientContext is not considered complete until the client has fully started up and will throw an error if called too soon. This method is meant to be used inside any functions returned as part of the Aspect control.

        - stopClient

          This is a function which will, when called, start the process of stopping the client. It is the same as calling the stop method off the client object itself.

      #### - __`onStart`__

      The method, onStart, is synchronous, can be overridden, and is called as the client is starting up. It is called after the onInitialize method is called for all Aspects and all promises returned from them have successfully resolved. This method is called to signal that everything is loaded and ready to be used. Any logic which requires the use of another aspect can safely be done here. This is where the main part of your application will probably start from.

      - Return Value

        There is no return value for this method

      - Parameters

        Only one parameter is provided to this method and that is the clientContext. This can be used as part of an Aspect final startup routine and all Aspect controls can safely be used at this point. Also any calls from getContext from within the Aspect controls will also work.

      #### - __`onStop`__

      The method, onStop, is asynchronous, can be overridden, and is called as the client is stopping. This method can be used for any teardown needed within an Aspect. A promise can be return

      - Return Value

        A promise can be returned from here and will delay the stopping of the client until it resolves. The client will not be able to be restarted until it has completely stopped.

      - Parameters

        There are no parameters provided to this method.

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

[GNU GENERAL PUBLIC LICENSE](https://github.com/CodeMedic42/reform/tree/main/LICENSE.md) © Christian Micle