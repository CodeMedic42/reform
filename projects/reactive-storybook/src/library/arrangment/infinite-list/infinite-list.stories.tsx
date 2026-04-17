/* eslint-disable import/no-anonymous-default-export */
import InfiniteList from '@reformjs/reactive/arrangement/infinite-list';
import defaultStory from './stories/default.story';

export default {
    title: 'Arrangement/InfiniteList',
    component: InfiniteList,
};

export const Default = {
    render: defaultStory,
};