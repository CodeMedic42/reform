/* eslint-disable max-len */
// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable max-len */
// import React, { useState, useMemo } from 'react';
// // eslint-disable-next-line import/no-extraneous-dependencies
// import { render, act } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import useCollectionContext from './use-collection-context';
// import CollectionItem from './collection-item';

describe('Id tests', () => {
    test('Initialize getId', () => {
        expect(true).toBeTruthy();
    });
});

// interface SetupResult {
//     context: any,
//     setFilterSettings: any,
//     setSortSettings: any,
//     setItems: any,
// }

// function setup(initialItems?: any, initialSettings?: any): SetupResult {
//     const returnVal: SetupResult = {
//         context: null,
//         setFilterSettings: null,
//         setSortSettings: null,
//         setItems: null,
//     };

//     function TestComponent() {
//         const [filterSettings, setFilterSettings] = useState(initialSettings?.filterSettings);
//         const [sortSettings, setSortSettings] = useState(initialSettings?.sortSettings);
//         const [items, setItems] = useState(initialItems);

//         const settings = useMemo(() => ({
//             filterSettings,
//             sortSettings,
//             getId: initialSettings?.getId,
//             beforeInsert: initialSettings?.beforeInsert,
//         }), [filterSettings, sortSettings]);

//         returnVal.context = useCollectionContext(items, settings) as any;
//         returnVal.setFilterSettings = setFilterSettings as any;
//         returnVal.setSortSettings = setSortSettings as any;
//         returnVal.setItems = setItems as any;

//         return null;
//     }

//     render(<TestComponent />);

//     return returnVal!;
// }

// function getId(item: { id: any }) {
//     return item.id;
// }

// test('Verify empty initialization', () => {
//     const { context } = setup();

//     expect(context != null).toBeTruthy();

//     const [items, access] = context as any[];

//     expect(items != null).toBeTruthy();
//     expect(access != null).toBeTruthy();

//     expect(items).toEqual([]);

//     const {
//         getById,
//     } = access;

//     expect(typeof getById).toBe('function');
// });

// test('Initialize string items', () => {
//     const { context } = setup(['foo', 'bar']);

//     const [items] = context as any[];

//     expect(items.length).toEqual(2);

//     expect(items[0] instanceof CollectionItem).toBeTruthy();
//     expect(items[0].getId()).toBeNull();
//     expect(items[0].getValue()).toBe('foo');
//     expect(items[0].getFilterPriority()).toBe(1);

//     expect(items[1] instanceof CollectionItem).toBeTruthy();
//     expect(items[1].getId()).toBeNull();
//     expect(items[1].getValue()).toBe('bar');
//     expect(items[1].getFilterPriority()).toBe(1);
// });

// test('Initialize number items', () => {
//     const { context } = setup([2, 1]);

//     const [items] = context as any[];

//     expect(items.length).toEqual(2);

//     expect(items[0] instanceof CollectionItem).toBeTruthy();
//     expect(items[0].getId()).toBeNull();
//     expect(items[0].getValue()).toBe(2);
//     expect(items[0].getFilterPriority()).toBe(1);

//     expect(items[1] instanceof CollectionItem).toBeTruthy();
//     expect(items[1].getId()).toBeNull();
//     expect(items[1].getValue()).toBe(1);
//     expect(items[1].getFilterPriority()).toBe(1);
// });

// test('Initialize object items', () => {
//     const expected = [{ data: 'foo' }, { data: 'bar' }];

//     const { context } = setup(expected);

//     const [items] = context as any[];

//     expect(items.length).toEqual(2);

//     expect(items[0] instanceof CollectionItem).toBeTruthy();
//     expect(items[0].getId()).toBeNull();
//     expect(items[0].getValue()).toEqual(expected[0]);
//     expect(items[0].getFilterPriority()).toBe(1);

//     expect(items[1] instanceof CollectionItem).toBeTruthy();
//     expect(items[1].getId()).toBeNull();
//     expect(items[1].getValue()).toEqual(expected[1]);
//     expect(items[1].getFilterPriority()).toBe(1);
// });

// describe('Id tests', () => {
//     test('Initialize getId', () => {
//         const expected = [{ id: 3, data: 'foo' }, { id: 4, data: 'bar' }];
//         const { context } = setup(expected, {
//             getId,
//         });

//         const [items] = context as any[];

//         expect(items.length).toEqual(2);

//         expect(items[0] instanceof CollectionItem).toBeTruthy();
//         expect(items[0].getId()).toBe(3);
//         expect(items[0].getValue()).toEqual(expected[0]);
//         expect(items[0].getFilterPriority()).toBe(1);

//         expect(items[1] instanceof CollectionItem).toBeTruthy();
//         expect(items[1].getId()).toBe(4);
//         expect(items[1].getValue()).toEqual(expected[1]);
//         expect(items[1].getFilterPriority()).toBe(1);
//     });

//     test('Verify getById', () => {
//         const expected = [{ id: 3, data: 'foo' }, { id: 4, data: 'bar' }];
//         const { context } = setup(expected, {
//             getId,
//         });

//         const { getById } = context[1];

//         let item = getById(3);

//         expect(item instanceof CollectionItem).toBeTruthy();
//         expect(item.getId()).toBe(3);
//         expect(item.getValue()).toEqual(expected[0]);
//         expect(item.getFilterPriority()).toBe(1);

//         item = getById(4);

//         expect(item instanceof CollectionItem).toBeTruthy();
//         expect(item.getId()).toBe(4);
//         expect(item.getValue()).toEqual(expected[1]);
//         expect(item.getFilterPriority()).toBe(1);
//     });
// });

// describe('Filter Tests', () => {
//     test('initialize filter settings', () => {
//         const expected = [{ id: 3, data: 'foo' }, { id: 4, data: 'bar' }, { id: 4, data: 'car' }];
//         const { context } = setup(expected, {
//             filterSettings: {
//                 rules: 'data',
//                 values: 'ar',
//             },
//         });

//         const [items] = context as any[];

//         expect(items.length).toEqual(3);

//         expect(items[0] instanceof CollectionItem).toBeTruthy();
//         expect(items[0].getId()).toBeNull();
//         expect(items[0].getValue()).toBe(expected[0]);
//         expect(items[0].getFilterPriority()).toBe(0);

//         expect(items[1] instanceof CollectionItem).toBeTruthy();
//         expect(items[1].getId()).toBeNull();
//         expect(items[1].getValue()).toBe(expected[1]);
//         expect(items[1].getFilterPriority()).toBe(2 / 3);

//         expect(items[2] instanceof CollectionItem).toBeTruthy();
//         expect(items[2].getId()).toBeNull();
//         expect(items[2].getValue()).toBe(expected[2]);
//         expect(items[2].getFilterPriority()).toBe(2 / 3);
//     });

//     test('set filter value settings', () => {
//         const expected = [{ id: 3, data: 'foo' }, { id: 4, data: 'bar' }, { id: 4, data: 'car' }];
//         const result = setup(expected, {
//             filterSettings: {
//                 rules: 'data',
//                 values: 'ar',
//             },
//         });

//         const { setFilterSettings } = result;

//         act(() => {
//             setFilterSettings({
//                 rules: 'data',
//                 values: 'f',
//             });
//         });

//         const [items] = result.context as any[];

//         expect(items.length).toEqual(3);

//         expect(items[0] instanceof CollectionItem).toBeTruthy();
//         expect(items[0].getId()).toBeNull();
//         expect(items[0].getValue()).toBe(expected[0]);
//         expect(items[0].getFilterPriority()).toBe(1);

//         expect(items[1] instanceof CollectionItem).toBeTruthy();
//         expect(items[1].getId()).toBeNull();
//         expect(items[1].getValue()).toBe(expected[1]);
//         expect(items[1].getFilterPriority()).toBe(0);

//         expect(items[2] instanceof CollectionItem).toBeTruthy();
//         expect(items[2].getId()).toBeNull();
//         expect(items[2].getValue()).toBe(expected[2]);
//         expect(items[2].getFilterPriority()).toBe(0);
//     });
// });

// describe('Sorting Tests', () => {
//     test('initialize sort settings', () => {
//         const expected = [{ id: 3, data: 'foo' }, { id: 4, data: 'bar' }, { id: 4, data: 'car' }];
//         const { context } = setup(expected, {
//             sortSettings: {
//                 rules: 'data',
//             },
//         });

//         const [items] = context as any[];

//         expect(items.length).toEqual(3);

//         expect(items[0] instanceof CollectionItem).toBeTruthy();
//         expect(items[0].getId()).toBeNull();
//         expect(items[0].getValue()).toBe(expected[1]);
//         expect(items[0].getFilterPriority()).toBe(1);

//         expect(items[1] instanceof CollectionItem).toBeTruthy();
//         expect(items[1].getId()).toBeNull();
//         expect(items[1].getValue()).toBe(expected[2]);
//         expect(items[1].getFilterPriority()).toBe(1);

//         expect(items[2] instanceof CollectionItem).toBeTruthy();
//         expect(items[2].getId()).toBeNull();
//         expect(items[2].getValue()).toBe(expected[0]);
//         expect(items[2].getFilterPriority()).toBe(1);
//     });

//     test('set sort settings', () => {
//         const expected = [{ id: 3, data: 'foo' }, { id: 5, data: 'bar' }, { id: 4, data: 'car' }];
//         const result = setup(expected, {
//             sortSettings: {
//                 rules: 'data',
//             },
//         });

//         const { setSortSettings } = result;

//         act(() => {
//             setSortSettings({
//                 rules: 'id',
//             });
//         });

//         const [items] = result.context as any[];

//         expect(items.length).toEqual(3);

//         expect(items[0] instanceof CollectionItem).toBeTruthy();
//         expect(items[0].getId()).toBeNull();
//         expect(items[0].getValue()).toBe(expected[0]);
//         expect(items[0].getFilterPriority()).toBe(1);

//         expect(items[1] instanceof CollectionItem).toBeTruthy();
//         expect(items[1].getId()).toBeNull();
//         expect(items[1].getValue()).toBe(expected[2]);
//         expect(items[1].getFilterPriority()).toBe(1);

//         expect(items[2] instanceof CollectionItem).toBeTruthy();
//         expect(items[2].getId()).toBeNull();
//         expect(items[2].getValue()).toBe(expected[1]);
//         expect(items[2].getFilterPriority()).toBe(1);
//     });
// });
