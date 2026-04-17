import { Aspect, AspectInitContext } from '@reformjs/girder';

interface MessagePrintControls {
    print: () => void;
}

class MessagePrintAspect extends Aspect {
    constructor() {
        super('messagePrint');
    }

    onInitialize(config: AspectInitContext): Promise<MessagePrintControls> {
        const { getSettings } = config;

        const controls: MessagePrintControls = {
            print: (): void => {
                (getSettings('messagePrint') as (string[] | null)[]).forEach((messages: string[] | null) => {
                    if (messages == null) {
                        return;
                    }

                    messages.forEach((message: string) => {
                        console.log(message);
                    });
                });
            }
        };

        return Promise.resolve(controls);
    }
}

export default MessagePrintAspect;
