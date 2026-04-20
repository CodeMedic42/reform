import Client from '@reformjs/girder';
import ApplicationAspect from './application-aspect.js';
import MessagePrintAspect from './message-print-aspect.js';

new Client()
    .registerAspect(new ApplicationAspect())
    .registerAspect(new MessagePrintAspect())
    .start();
