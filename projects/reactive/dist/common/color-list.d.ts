export function getSchemeColorClasses({ colorRequired, color, enableBorder, design, borderWidth, }: {
    colorRequired?: boolean | undefined;
    color: any;
    enableBorder: any;
    design: any;
    borderWidth: any;
}): string;
export function getPaletteColorClasses({ colorRequired, color, enableBorder, enableBackground, shade, borderWidth, }: {
    colorRequired?: boolean | undefined;
    color: any;
    enableBorder: any;
    enableBackground: any;
    shade: any;
    borderWidth: any;
}): string;
export const schemeColorOrder: string[];
export const paletteColorOrder: string[];
export const paletteShades: string[];
export const colorOrder: string[];
export const functionalColorLevels: {};
export const paletteColorLevels: {};
export function getColorInfo(options: any): {
    colorClasses: string;
    isSchemeColor: boolean;
};
export const schemeColorPropType: any;
export const paletteColorPropType: any;
export const colorPropType: any;
export const shadePropType: any;
//# sourceMappingURL=color-list.d.ts.map