import Client from '@reformjs/girder';
import { FluxibleReactAspect } from '@reformjs/girder-store-aspect/fluxible';
import ApplicationAspect from './application-aspect';

new Client()
    .registerAspect(new FluxibleReactAspect())
    .registerAspect(new ApplicationAspect())
    .start();
