import Client from '@reformjs/girder';
import ApplicationAspect from './application-aspect';
import HelloAspect from './hello-aspect';

new Client()
    .registerAspect(new ApplicationAspect())
    .registerAspect(new HelloAspect())
    .start();
