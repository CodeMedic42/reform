function consoleGreet(context, name) {
    const greeting = context.getAspect('hello').greet(name);

    console.log(greeting);
}

export default consoleGreet;