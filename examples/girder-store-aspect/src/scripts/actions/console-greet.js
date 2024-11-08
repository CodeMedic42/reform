function consoleGreet(context, name) {
    const greeting = context.hello.greet(name);

    console.log(greeting);
}

export default consoleGreet;