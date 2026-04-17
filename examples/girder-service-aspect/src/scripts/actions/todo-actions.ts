export function toggleAll(context, completed) {
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
