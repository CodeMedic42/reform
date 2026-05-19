import React, { useCallback, useState } from 'react';
import { NumberInput } from '../components/NumberInput';
import { SectionHeader } from '../components/SectionHeader';
import type {
    ConfigState,
    HeadingLevelConfig,
    TextSizeConfig,
    ParagraphSizeConfig,
} from '../types';

const warningStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#dc3545',
    marginTop: '4px',
    padding: '4px 8px',
    background: '#fff3f3',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
};

const addButtonStyle: React.CSSProperties = {
    padding: '4px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid #029cfd',
    background: '#029cfd',
    color: '#fff',
};

const checkboxRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '8px 0 4px 0',
};

const checkboxLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#555',
};

const tierGroupStyle: React.CSSProperties = {
    paddingLeft: '16px',
    borderLeft: '2px solid #e6e6e6',
    marginBottom: '8px',
};

const addBarStyle: React.CSSProperties = {
    marginTop: '12px',
    padding: '8px 0',
};

const weightAddBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginTop: '12px',
    padding: '8px 0',
};

const weightInputStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100px',
};

const DEFAULT_HEADING_LEVEL: HeadingLevelConfig = {
    'font-size': '24px',
    'line-height': '30px',
    mobile: null,
    desktop: null,
};

const DEFAULT_TEXT_SIZE: TextSizeConfig = {
    'font-size': '16px',
    'line-height': '20px',
    mobile: null,
    desktop: null,
};

const DEFAULT_PARAGRAPH_SIZE: ParagraphSizeConfig = {
    'font-size': '16px',
    'line-height': '22px',
    'margin-bottom': '24px',
    mobile: null,
    desktop: null,
};

interface TypographySectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

function BreakpointWarnings({ config, hasMobile, hasDesktop }: { config: ConfigState; hasMobile: boolean; hasDesktop: boolean }) {
    const tabletSet = config.layout.tabletBreakpoint !== null;
    const desktopSet = config.layout.desktopBreakpoint !== null;

    return (
        <>
            {hasMobile && !tabletSet && (
                <div style={warningStyle}>
                    Mobile tier is enabled but no tablet breakpoint is set in Layout configuration. The tablet media query will not be generated.
                </div>
            )}
            {hasDesktop && !desktopSet && (
                <div style={warningStyle}>
                    Desktop tier is enabled but no desktop breakpoint is set in Layout configuration. The desktop media query will not be generated.
                </div>
            )}
        </>
    );
}

function HeadingLevelEditor({
    level,
    index,
    onUpdate,
}: {
    level: HeadingLevelConfig;
    index: number;
    onUpdate: (key: string, value: unknown) => void;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ ...checkboxLabelStyle, fontSize: '11px', color: '#888', marginBottom: '2px' }}>Tablet (Base)</div>
            <NumberInput
                label="Font Size"
                value={level['font-size']}
                onChange={(v) => onUpdate('font-size', v)}
            />
            <NumberInput
                label="Line Height"
                value={level['line-height']}
                onChange={(v) => onUpdate('line-height', v)}
            />

            <div style={checkboxRowStyle}>
                <input
                    type="checkbox"
                    checked={level.mobile !== null}
                    onChange={() => {
                        if (level.mobile !== null) {
                            onUpdate('mobile', null);
                        } else {
                            onUpdate('mobile', { 'font-size': level['font-size'], 'line-height': level['line-height'] });
                        }
                    }}
                />
                <span style={checkboxLabelStyle}>Enable Mobile Tier</span>
            </div>
            {level.mobile !== null && (
                <div style={tierGroupStyle}>
                    <NumberInput
                        label="Font Size"
                        value={level.mobile['font-size']}
                        onChange={(v) => onUpdate('mobile', { ...level.mobile, 'font-size': v })}
                    />
                    <div style={{ height: '8px' }} />
                    <NumberInput
                        label="Line Height"
                        value={level.mobile['line-height']}
                        onChange={(v) => onUpdate('mobile', { ...level.mobile, 'line-height': v })}
                    />
                </div>
            )}

            <div style={checkboxRowStyle}>
                <input
                    type="checkbox"
                    checked={level.desktop !== null}
                    onChange={() => {
                        if (level.desktop !== null) {
                            onUpdate('desktop', null);
                        } else {
                            onUpdate('desktop', { 'font-size': level['font-size'], 'line-height': level['line-height'] });
                        }
                    }}
                />
                <span style={checkboxLabelStyle}>Enable Desktop Tier</span>
            </div>
            {level.desktop !== null && (
                <div style={tierGroupStyle}>
                    <NumberInput
                        label="Font Size"
                        value={level.desktop['font-size']}
                        onChange={(v) => onUpdate('desktop', { ...level.desktop, 'font-size': v })}
                    />
                    <div style={{ height: '8px' }} />
                    <NumberInput
                        label="Line Height"
                        value={level.desktop['line-height']}
                        onChange={(v) => onUpdate('desktop', { ...level.desktop, 'line-height': v })}
                    />
                </div>
            )}
        </div>
    );
}

function ParagraphSizeEditor({
    size,
    index,
    onUpdate,
}: {
    size: ParagraphSizeConfig;
    index: number;
    onUpdate: (key: string, value: unknown) => void;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ ...checkboxLabelStyle, fontSize: '11px', color: '#888', marginBottom: '2px' }}>Tablet (Base)</div>
            <NumberInput
                label="Font Size"
                value={size['font-size']}
                onChange={(v) => onUpdate('font-size', v)}
            />
            <NumberInput
                label="Line Height"
                value={size['line-height']}
                onChange={(v) => onUpdate('line-height', v)}
            />
            <NumberInput
                label="Margin Bottom"
                value={size['margin-bottom']}
                onChange={(v) => onUpdate('margin-bottom', v)}
            />

            <div style={checkboxRowStyle}>
                <input
                    type="checkbox"
                    checked={size.mobile !== null}
                    onChange={() => {
                        if (size.mobile !== null) {
                            onUpdate('mobile', null);
                        } else {
                            onUpdate('mobile', {
                                'font-size': size['font-size'],
                                'line-height': size['line-height'],
                                'margin-bottom': size['margin-bottom'],
                            });
                        }
                    }}
                />
                <span style={checkboxLabelStyle}>Enable Mobile Tier</span>
            </div>
            {size.mobile !== null && (
                <div style={tierGroupStyle}>
                    <NumberInput
                        label="Font Size"
                        value={size.mobile['font-size']}
                        onChange={(v) => onUpdate('mobile', { ...size.mobile, 'font-size': v })}
                    />
                    <div style={{ height: '8px' }} />
                    <NumberInput
                        label="Line Height"
                        value={size.mobile['line-height']}
                        onChange={(v) => onUpdate('mobile', { ...size.mobile, 'line-height': v })}
                    />
                    <div style={{ height: '8px' }} />
                    <NumberInput
                        label="Margin Bottom"
                        value={size.mobile['margin-bottom']}
                        onChange={(v) => onUpdate('mobile', { ...size.mobile, 'margin-bottom': v })}
                    />
                </div>
            )}

            <div style={checkboxRowStyle}>
                <input
                    type="checkbox"
                    checked={size.desktop !== null}
                    onChange={() => {
                        if (size.desktop !== null) {
                            onUpdate('desktop', null);
                        } else {
                            onUpdate('desktop', {
                                'font-size': size['font-size'],
                                'line-height': size['line-height'],
                                'margin-bottom': size['margin-bottom'],
                            });
                        }
                    }}
                />
                <span style={checkboxLabelStyle}>Enable Desktop Tier</span>
            </div>
            {size.desktop !== null && (
                <div style={tierGroupStyle}>
                    <NumberInput
                        label="Font Size"
                        value={size.desktop['font-size']}
                        onChange={(v) => onUpdate('desktop', { ...size.desktop, 'font-size': v })}
                    />
                    <div style={{ height: '8px' }} />
                    <NumberInput
                        label="Line Height"
                        value={size.desktop['line-height']}
                        onChange={(v) => onUpdate('desktop', { ...size.desktop, 'line-height': v })}
                    />
                    <div style={{ height: '8px' }} />
                    <NumberInput
                        label="Margin Bottom"
                        value={size.desktop['margin-bottom']}
                        onChange={(v) => onUpdate('desktop', { ...size.desktop, 'margin-bottom': v })}
                    />
                </div>
            )}
        </div>
    );
}

export function TypographySection({ config, onChange }: TypographySectionProps) {
    const [newWeightName, setNewWeightName] = useState('');
    const typo = config.typography;

    // === Base Typography ===

    const updateBase = useCallback((key: keyof ConfigState['base'], value: string | number) => {
        onChange((prev) => ({
            ...prev,
            base: { ...prev.base, [key]: value },
        }));
    }, [onChange]);

    // === Heading ===

    const updateHeading = useCallback((key: string, value: unknown) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                heading: { ...prev.typography.heading, [key]: value },
            },
        }));
    }, [onChange]);

    const updateHeadingLevel = useCallback((index: number, key: string, value: unknown) => {
        onChange((prev) => {
            const levels = [...prev.typography.heading.levels];
            levels[index] = { ...levels[index], [key]: value };
            return {
                ...prev,
                typography: {
                    ...prev.typography,
                    heading: { ...prev.typography.heading, levels },
                },
            };
        });
    }, [onChange]);

    const addHeadingLevel = useCallback(() => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                heading: {
                    ...prev.typography.heading,
                    levels: [...prev.typography.heading.levels, { ...DEFAULT_HEADING_LEVEL }],
                },
            },
        }));
    }, [onChange]);

    const removeHeadingLevel = useCallback((index: number) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                heading: {
                    ...prev.typography.heading,
                    levels: prev.typography.heading.levels.filter((_, i) => i !== index),
                },
            },
        }));
    }, [onChange]);

    // === SubHeading ===

    const updateSubHeading = useCallback((key: string, value: unknown) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                subHeading: { ...prev.typography.subHeading, [key]: value },
            },
        }));
    }, [onChange]);

    const updateSubHeadingLevel = useCallback((index: number, key: string, value: unknown) => {
        onChange((prev) => {
            const levels = [...prev.typography.subHeading.levels];
            levels[index] = { ...levels[index], [key]: value };
            return {
                ...prev,
                typography: {
                    ...prev.typography,
                    subHeading: { ...prev.typography.subHeading, levels },
                },
            };
        });
    }, [onChange]);

    const addSubHeadingLevel = useCallback(() => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                subHeading: {
                    ...prev.typography.subHeading,
                    levels: [...prev.typography.subHeading.levels, { ...DEFAULT_HEADING_LEVEL }],
                },
            },
        }));
    }, [onChange]);

    const removeSubHeadingLevel = useCallback((index: number) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                subHeading: {
                    ...prev.typography.subHeading,
                    levels: prev.typography.subHeading.levels.filter((_, i) => i !== index),
                },
            },
        }));
    }, [onChange]);

    // === Text ===

    const updateText = useCallback((key: string, value: unknown) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                text: { ...prev.typography.text, [key]: value },
            },
        }));
    }, [onChange]);

    const updateTextSize = useCallback((index: number, key: string, value: unknown) => {
        onChange((prev) => {
            const sizes = [...prev.typography.text.sizes];
            sizes[index] = { ...sizes[index], [key]: value };
            return {
                ...prev,
                typography: {
                    ...prev.typography,
                    text: { ...prev.typography.text, sizes },
                },
            };
        });
    }, [onChange]);

    const addTextSize = useCallback(() => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                text: {
                    ...prev.typography.text,
                    sizes: [...prev.typography.text.sizes, { ...DEFAULT_TEXT_SIZE }],
                },
            },
        }));
    }, [onChange]);

    const removeTextSize = useCallback((index: number) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                text: {
                    ...prev.typography.text,
                    sizes: prev.typography.text.sizes.filter((_, i) => i !== index),
                },
            },
        }));
    }, [onChange]);

    // === Paragraph ===

    const updateParagraph = useCallback((key: string, value: unknown) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                paragraph: { ...prev.typography.paragraph, [key]: value },
            },
        }));
    }, [onChange]);

    const updateParagraphSize = useCallback((index: number, key: string, value: unknown) => {
        onChange((prev) => {
            const sizes = [...prev.typography.paragraph.sizes];
            sizes[index] = { ...sizes[index], [key]: value };
            return {
                ...prev,
                typography: {
                    ...prev.typography,
                    paragraph: { ...prev.typography.paragraph, sizes },
                },
            };
        });
    }, [onChange]);

    const addParagraphSize = useCallback(() => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                paragraph: {
                    ...prev.typography.paragraph,
                    sizes: [...prev.typography.paragraph.sizes, { ...DEFAULT_PARAGRAPH_SIZE }],
                },
            },
        }));
    }, [onChange]);

    const removeParagraphSize = useCallback((index: number) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                paragraph: {
                    ...prev.typography.paragraph,
                    sizes: prev.typography.paragraph.sizes.filter((_, i) => i !== index),
                },
            },
        }));
    }, [onChange]);

    // === Caption ===

    const updateCaption = useCallback((key: string, value: string | number) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                caption: { ...prev.typography.caption, [key]: value },
            },
        }));
    }, [onChange]);

    // === Overline ===

    const updateOverline = useCallback((key: string, value: string | number) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                overline: { ...prev.typography.overline, [key]: value },
            },
        }));
    }, [onChange]);

    // === Weights ===

    const updateWeight = useCallback((name: string, value: number) => {
        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                weights: { ...prev.typography.weights, [name]: value },
            },
        }));
    }, [onChange]);

    const addWeight = useCallback(() => {
        const name = newWeightName.trim().toLowerCase();
        if (!name || typo.weights[name] !== undefined) return;

        onChange((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                weights: { ...prev.typography.weights, [name]: 400 },
            },
        }));
        setNewWeightName('');
    }, [newWeightName, typo.weights, onChange]);

    const removeWeight = useCallback((name: string) => {
        onChange((prev) => {
            const weights = { ...prev.typography.weights };
            delete weights[name];
            return {
                ...prev,
                typography: { ...prev.typography, weights },
            };
        });
    }, [onChange]);

    // Check if any level/size has responsive tiers enabled
    const headingHasMobile = typo.heading.levels.some((l) => l.mobile !== null);
    const headingHasDesktop = typo.heading.levels.some((l) => l.desktop !== null);
    const subHeadingHasMobile = typo.subHeading.levels.some((l) => l.mobile !== null);
    const subHeadingHasDesktop = typo.subHeading.levels.some((l) => l.desktop !== null);
    const textHasMobile = typo.text.sizes.some((s) => s.mobile !== null);
    const textHasDesktop = typo.text.sizes.some((s) => s.desktop !== null);
    const paragraphHasMobile = typo.paragraph.sizes.some((s) => s.mobile !== null);
    const paragraphHasDesktop = typo.paragraph.sizes.some((s) => s.desktop !== null);

    return (
        <div>
            {/* Base Typography */}
            <SectionHeader title="Base Typography" level={0} defaultOpen>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NumberInput
                        label="Font Size"
                        value={config.base.fontSize}
                        onChange={(v) => updateBase('fontSize', v)}
                    />
                    <NumberInput
                        label="Font Weight"
                        value={String(config.base.fontWeight)}
                        onChange={(v) => updateBase('fontWeight', parseInt(v) || 400)}
                    />
                </div>
            </SectionHeader>

            {/* Heading */}
            <SectionHeader title="Heading" level={0}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NumberInput
                        label="Color"
                        value={typo.heading.color}
                        onChange={(v) => updateHeading('color', v)}
                    />
                    <NumberInput
                        label="Font Weight"
                        value={String(typo.heading['font-weight'])}
                        onChange={(v) => updateHeading('font-weight', parseInt(v) || 700)}
                    />
                </div>

                <BreakpointWarnings config={config} hasMobile={headingHasMobile} hasDesktop={headingHasDesktop} />

                {typo.heading.levels.map((level, i) => (
                    <SectionHeader
                        key={i}
                        title={`Level ${i + 1}`}
                        level={1}
                        onRemove={typo.heading.levels.length > 1 ? () => removeHeadingLevel(i) : undefined}
                    >
                        <HeadingLevelEditor
                            level={level}
                            index={i}
                            onUpdate={(key, value) => updateHeadingLevel(i, key, value)}
                        />
                    </SectionHeader>
                ))}

                <div style={addBarStyle}>
                    <button style={addButtonStyle} onClick={addHeadingLevel}>
                        Add Level
                    </button>
                </div>
            </SectionHeader>

            {/* SubHeading */}
            <SectionHeader title="Sub-Heading" level={0}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NumberInput
                        label="Color"
                        value={typo.subHeading.color}
                        onChange={(v) => updateSubHeading('color', v)}
                    />
                    <NumberInput
                        label="Font Weight"
                        value={String(typo.subHeading['font-weight'])}
                        onChange={(v) => updateSubHeading('font-weight', parseInt(v) || 700)}
                    />
                </div>

                <BreakpointWarnings config={config} hasMobile={subHeadingHasMobile} hasDesktop={subHeadingHasDesktop} />

                {typo.subHeading.levels.map((level, i) => (
                    <SectionHeader
                        key={i}
                        title={`Level ${i + 1}`}
                        level={1}
                        onRemove={typo.subHeading.levels.length > 1 ? () => removeSubHeadingLevel(i) : undefined}
                    >
                        <HeadingLevelEditor
                            level={level}
                            index={i}
                            onUpdate={(key, value) => updateSubHeadingLevel(i, key, value)}
                        />
                    </SectionHeader>
                ))}

                <div style={addBarStyle}>
                    <button style={addButtonStyle} onClick={addSubHeadingLevel}>
                        Add Level
                    </button>
                </div>
            </SectionHeader>

            {/* Text */}
            <SectionHeader title="Text" level={0}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NumberInput
                        label="Color"
                        value={typo.text.color}
                        onChange={(v) => updateText('color', v)}
                    />
                    <NumberInput
                        label="Font Weight"
                        value={String(typo.text['font-weight'])}
                        onChange={(v) => updateText('font-weight', parseInt(v) || 400)}
                    />
                </div>

                <BreakpointWarnings config={config} hasMobile={textHasMobile} hasDesktop={textHasDesktop} />

                {typo.text.sizes.map((size, i) => (
                    <SectionHeader
                        key={i}
                        title={`Size ${i + 1}`}
                        level={1}
                        onRemove={typo.text.sizes.length > 1 ? () => removeTextSize(i) : undefined}
                    >
                        <HeadingLevelEditor
                            level={size}
                            index={i}
                            onUpdate={(key, value) => updateTextSize(i, key, value)}
                        />
                    </SectionHeader>
                ))}

                <div style={addBarStyle}>
                    <button style={addButtonStyle} onClick={addTextSize}>
                        Add Size
                    </button>
                </div>
            </SectionHeader>

            {/* Paragraph */}
            <SectionHeader title="Paragraph" level={0}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NumberInput
                        label="Color"
                        value={typo.paragraph.color}
                        onChange={(v) => updateParagraph('color', v)}
                    />
                    <NumberInput
                        label="Font Weight"
                        value={String(typo.paragraph['font-weight'])}
                        onChange={(v) => updateParagraph('font-weight', parseInt(v) || 400)}
                    />
                </div>

                <BreakpointWarnings config={config} hasMobile={paragraphHasMobile} hasDesktop={paragraphHasDesktop} />

                {typo.paragraph.sizes.map((size, i) => (
                    <SectionHeader
                        key={i}
                        title={`Size ${i + 1}`}
                        level={1}
                        onRemove={typo.paragraph.sizes.length > 1 ? () => removeParagraphSize(i) : undefined}
                    >
                        <ParagraphSizeEditor
                            size={size}
                            index={i}
                            onUpdate={(key, value) => updateParagraphSize(i, key, value)}
                        />
                    </SectionHeader>
                ))}

                <div style={addBarStyle}>
                    <button style={addButtonStyle} onClick={addParagraphSize}>
                        Add Size
                    </button>
                </div>
            </SectionHeader>

            {/* Caption */}
            <SectionHeader title="Caption" level={0}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NumberInput
                        label="Font Size"
                        value={typo.caption['font-size']}
                        onChange={(v) => updateCaption('font-size', v)}
                    />
                    <NumberInput
                        label="Line Height"
                        value={typo.caption['line-height']}
                        onChange={(v) => updateCaption('line-height', v)}
                    />
                    <NumberInput
                        label="Color"
                        value={typo.caption.color}
                        onChange={(v) => updateCaption('color', v)}
                    />
                    <NumberInput
                        label="Font Weight"
                        value={String(typo.caption['font-weight'])}
                        onChange={(v) => updateCaption('font-weight', parseInt(v) || 700)}
                    />
                </div>
            </SectionHeader>

            {/* Overline */}
            <SectionHeader title="Overline" level={0}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NumberInput
                        label="Font Size"
                        value={typo.overline['font-size']}
                        onChange={(v) => updateOverline('font-size', v)}
                    />
                    <NumberInput
                        label="Line Height"
                        value={typo.overline['line-height']}
                        onChange={(v) => updateOverline('line-height', v)}
                    />
                    <NumberInput
                        label="Color"
                        value={typo.overline.color}
                        onChange={(v) => updateOverline('color', v)}
                    />
                    <NumberInput
                        label="Font Weight"
                        value={String(typo.overline['font-weight'])}
                        onChange={(v) => updateOverline('font-weight', parseInt(v) || 600)}
                    />
                </div>
            </SectionHeader>

            {/* Weights */}
            <SectionHeader title="Weight Classes" level={0}>
                {Object.entries(typo.weights).map(([name, value]) => (
                    <SectionHeader
                        key={name}
                        title={name}
                        level={1}
                        defaultOpen
                        onRemove={Object.keys(typo.weights).length > 1 ? () => removeWeight(name) : undefined}
                    >
                        <NumberInput
                            label="Value"
                            value={String(value)}
                            onChange={(v) => updateWeight(name, parseInt(v) || 400)}
                        />
                    </SectionHeader>
                ))}

                <div style={weightAddBarStyle}>
                    <input
                        type="text"
                        placeholder="Weight name"
                        value={newWeightName}
                        onChange={(e) => setNewWeightName(e.target.value)}
                        style={weightInputStyle}
                        onKeyDown={(e) => e.key === 'Enter' && addWeight()}
                    />
                    <button style={addButtonStyle} onClick={addWeight}>
                        Add Weight
                    </button>
                </div>
            </SectionHeader>
        </div>
    );
}
