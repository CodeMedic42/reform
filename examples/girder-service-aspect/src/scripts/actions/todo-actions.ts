interface ServiceContext {
    getAspect(name: string): {
        todos: {
            toggle: (params: { data: { completed: boolean } }) => void;
        };
    };
}

export function toggleAll(context: ServiceContext, completed: boolean): void {
    const {
        todos: {
            toggle,
        }
    } = context.getAspect('service');

    toggle({
        data: {
            completed,
        }
    });
}
