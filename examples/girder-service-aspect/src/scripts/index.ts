import Client from '@reformjs/girder';
import MobxAspect from '@reformjs/girder-store-aspect/mobx';
import ServiceAspect from '@reformjs/girder-service-aspect';
import ApplicationAspect from './application-aspect';

new Client()
    .registerAspect(new MobxAspect())
    .registerAspect(new ServiceAspect())
    .registerAspect(new ApplicationAspect())
    .start();
