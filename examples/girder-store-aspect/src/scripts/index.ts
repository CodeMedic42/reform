import Client from '@reformjs/girder';
import MobxAspect from '@reformjs/girder-store-aspect/mobx';
import ApplicationAspect from './application-aspect';

new Client()
    .registerAspect(new MobxAspect())
    .registerAspect(new ApplicationAspect())
    .start();
