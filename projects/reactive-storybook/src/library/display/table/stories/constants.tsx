import React from 'react';
import { RowHeaderBase } from '@reformjs/reactive/display/table';
import type { SimpleTableColumn } from '@reformjs/reactive/display/table';

const items = [
    {
        name: { firstName: 'Marty', lastName: 'McFly' },
        dob: '01/02/1960',
        dobTime: new Date('01/02/1960').getTime(),
        gender: 'Male',
        fullAddress: '123 Electric Rd',
        homePhone: '555-123-4567',
        status: 'CHECKED_IN',
        id: '1',
    },
    {
        name: { firstName: 'Willsmith', lastName: 'Smith' },
        dob: '01/02/1969',
        dobTime: new Date('01/02/1969').getTime(),
        gender: 'Male',
        fullAddress: 'West Philadelphia',
        homePhone: '555-999-9999',
        status: 'CHECKED_OUT',
        id: '2',
    },
    {
        name: { lastName: 'Lemon' },
        dob: '10/10/1990',
        dobTime: new Date('10/10/1990').getTime(),
        gender: 'Female',
        fullAddress: '567 Drive Rd',
        homePhone: '555-555-5555',
        status: 'NEW',
        id: '3',
    },
    {
        name: { firstName: 'Josh' },
        dob: '10/10/1980',
        dobTime: new Date('10/10/1980').getTime(),
        gender: 'Male',
        fullAddress: '432 Road Dr',
        homePhone: '555-333-4444',
        status: 'REMOVED',
        id: '4',
    },
    {
        name: { firstName: 'Michelle', lastName: 'Obama' },
        dob: '01/17/1964',
        dobTime: new Date('01/17/1964').getTime(),
        gender: 'Female',
        fullAddress: '1600 Pennsylvania Ave',
        homePhone: '555-111-2222',
        status: 'NEW',
        id: '5',
    },
];

const statuses: Record<string, string> = {
    NEW: 'New',
    CHECKED_IN: 'Checked In',
    CHECKED_OUT: 'Checked Out',
    REMOVED: 'Removed',
};

const columns: SimpleTableColumn[] = [
    {
        headerBody: 'Name',
        cellValuePath: ['name.firstName', 'name.lastName', 'id'],
        width: '160px',
        sortable: true,
        renderCell: (cellValue) => {
            const [firstName, lastName, id] = cellValue as [string, string, string];
            return (
                <RowHeaderBase
                    headerText={`${firstName ?? ''} ${lastName ?? ''}`.trim()}
                    subHeaderText={id}
                />
            );
        },
    },
    {
        headerBody: 'DOB',
        cellValuePath: 'dob',
        cellSortPath: 'dobTime',
        width: '16%',
        sortable: true,
    },
    {
        headerBody: 'Gender',
        cellValuePath: 'gender',
        width: '90px',
    },
    {
        headerBody: 'Address',
        cellValuePath: 'fullAddress',
        width: '30%',
        sortable: true,
    },
    {
        headerBody: 'Phone',
        cellValuePath: 'homePhone',
        width: '20%',
    },
    {
        headerBody: 'Status',
        width: '20%',
        cellValuePath: 'status',
        sortable: true,
        renderCell: (cellValue) => statuses[cellValue as string],
    },
];

export { items, columns };
