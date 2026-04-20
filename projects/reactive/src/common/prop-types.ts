import React from 'react';

export interface IconType {
    icon: any[];
    prefix: string;
    iconName: string;
}

export interface InputMessages {
    general?: string[];
    success?: string[];
    failure?: string[];
}

export type ComponentType = string | React.ElementType;
