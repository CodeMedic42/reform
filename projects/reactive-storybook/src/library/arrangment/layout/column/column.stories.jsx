import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';

// import numberedColumns from './stories/numbered-columns.story';
import reflexiveNumberedColumns from './stories/reflexive-numbered-columns.story';
import evenReflexiveLayoutWithFill from './stories/even-reflexive-layout-with-fill.story';
import reflexiveLayoutWithContent from './stories/reflexive-layout-with-content.story';
import reflexiveLayoutWithStatic from './stories/reflexive-layout-with-static.story';
import comboReflexiveLayout from './stories/combo-reflexive-layout.story';
import itemLeftOffsetBy1Columns from './stories/item-left-offset-by-1-columns.story';
import itemLeftOffsetByFill from './stories/item-left-offset-by-fill.story';
import itemRightOffsetBy1Columns from './stories/item-right-offset-by-1-columns.story';
import itemRightOffsetByFill from './stories/item-right-offset-by-fill.story';
import numberedColumnsEmbeddedRows from './stories/numbered-columns-embedded-rows.story';
import contentColumnsEmbeddedRows from './stories/content-columns-embedded-rows.story';
import staticColumnsEmbeddedRows from './stories/static-columns-embedded-rows.story';
import justification from './stories/justification.story';
import alignment from './stories/alignment.story';
import emptyColumn from './stories/empty-column.story';
import orderedColumns from './stories/ordered-columns.story';
import minWidthColumns from './stories/min-width-columns.story';
import maxWidthColumns from './stories/max-width-columns.story';
import paddingTopColumns from './stories/padding-top-columns.story';

import ResolutionHeader from '../common/resolution-header';
import LayoutScope from '../common/layout-scope';
import Content from '../common/content';

// export default {
//     title: 'Arrangement/Layout/Column',
// };

export default {
    title: 'Arrangement/Layout/Column',
    component: Column,
    tags: ['autodocs'],
    // argTypes: {
    //     className: {
    //         control: 'text',
    //     },
    //     children: {
    //         control: 'text',
    //     },
    //     design: {
    //         control: 'text',
    //     },
    //     color: {
    //         control: 'text',
    //     },
    //     variant: {
    //         control: 'text',
    //     },
    //     disabled: {
    //         control: 'boolean',
    //     },
    //     focusOnMount: {
    //         control: 'boolean',
    //     },
    //     Component: {
    //         control: 'text',
    //     },
    // },
};

export const NumberedColumns = {
    render: () => (
        <>
            <ResolutionHeader sticky />
            <LayoutScope>
                <Row gutter="16">
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="2">
                        <Content>2</Content>
                    </Column>
                    <Column width="2">
                        <Content>2</Content>
                    </Column>
                    <Column width="2">
                        <Content>2</Content>
                    </Column>
                    <Column width="2">
                        <Content>2</Content>
                    </Column>
                    <Column width="2">
                        <Content>2</Content>
                    </Column>
                    <Column width="2">
                        <Content>2</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="4">
                        <Content>4</Content>
                    </Column>
                    <Column width="4">
                        <Content>4</Content>
                    </Column>
                    <Column width="4">
                        <Content>4</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="5">
                        <Content>5</Content>
                    </Column>
                    <Column width="5">
                        <Content>5</Content>
                    </Column>
                    <Column width="2">
                        <Content>2</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="6">
                        <Content>6</Content>
                    </Column>
                    <Column width="6">
                        <Content>6</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="7">
                        <Content>7</Content>
                    </Column>
                    <Column width="5">
                        <Content>5</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="8">
                        <Content>8</Content>
                    </Column>
                    <Column width="4">
                        <Content>4</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="9">
                        <Content>9</Content>
                    </Column>
                    <Column width="3">
                        <Content>3</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="10">
                        <Content>10</Content>
                    </Column>
                    <Column width="2">
                        <Content>2</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="11">
                        <Content>11</Content>
                    </Column>
                    <Column width="1">
                        <Content>1</Content>
                    </Column>
                </Row>
                <Row gutter="16">
                    <Column width="12">
                        <Content>12</Content>
                    </Column>
                </Row>
            </LayoutScope>
        </>
    ),
};

export const ReflexiveNumberedColumns = {
    render: reflexiveNumberedColumns,
};

export const EvenReflexiveLayoutWithFill = {
    render: evenReflexiveLayoutWithFill,
};

export const ReflexiveLayoutWithContent = {
    render: reflexiveLayoutWithContent,
};

export const ReflexiveLayoutWithStatic = {
    render: reflexiveLayoutWithStatic,
};

export const ComboReflexiveLayout = {
    render: comboReflexiveLayout,
};

export const ItemLeftOffsetBy1Columns = {
    render: itemLeftOffsetBy1Columns,
};

export const ItemLeftOffsetByFill = {
    render: itemLeftOffsetByFill,
};

export const ItemRightOffsetBy1Columns = {
    render: itemRightOffsetBy1Columns,
};

export const ItemRightOffsetByFill = {
    render: itemRightOffsetByFill,
};

export const NumberedColumnsEmbeddedRows = {
    render: numberedColumnsEmbeddedRows,
};

export const ContentColumnsEmbeddedRows = {
    render: contentColumnsEmbeddedRows,
};

export const StaticColumnsEmbeddedRows = {
    render: staticColumnsEmbeddedRows,
};

export const Justification = {
    render: justification,
};

export const Alignment = {
    render: alignment,
};

export const EmptyColumn = {
    render: emptyColumn,
};

export const OrderedColumns = {
    render: orderedColumns,
};

export const MinWidthColumns = {
    render: minWidthColumns,
};

export const MaxWidthColumns = {
    render: maxWidthColumns,
};

export const PaddingTopColumns = {
    render: paddingTopColumns,
};
