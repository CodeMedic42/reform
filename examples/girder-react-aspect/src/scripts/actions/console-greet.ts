interface GreetContext {
    getAspect: (aspectId: string) => { greet: (name: string) => string };
}

function consoleGreet(context: GreetContext, name: string): void {
    const greeting = context.getAspect('hello').greet(name);

    console.log(greeting);
}

export default consoleGreet;
