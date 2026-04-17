import Client from '@reformjs/girder';
import ApplicationAspect from './application-aspect';
import MessagePrintAspect from './message-print-aspect';

new Client()
    .registerAspect(new ApplicationAspect())
    .registerAspect(new MessagePrintAspect())
    .start();
