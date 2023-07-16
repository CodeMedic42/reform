import Client from '@reformjs/girder';
import ApplicationAspect from './application-aspect';

new Client()
    .registerAspect(new ApplicationAspect())
    .start();
