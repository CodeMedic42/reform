import React from 'react';
import { Row, Column } from '@reformjs/reactive/arrangement/layout';
import Content from '../common/content';

export default function renderForGutter(gutter) {
    return (
        <>
            <Row gutter={gutter}>
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
            <Row gutter={gutter}>
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
            <Row gutter={gutter}>
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
            <Row gutter={gutter}>
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
            <Row gutter={gutter}>
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
            <Row gutter={gutter}>
                <Column width="6">
                    <Content>6</Content>
                </Column>
                <Column width="6">
                    <Content>6</Content>
                </Column>
            </Row>
            <Row gutter={gutter}>
                <Column width="7">
                    <Content>7</Content>
                </Column>
                <Column width="5">
                    <Content>5</Content>
                </Column>
            </Row>
            <Row gutter={gutter}>
                <Column width="8">
                    <Content>8</Content>
                </Column>
                <Column width="4">
                    <Content>4</Content>
                </Column>
            </Row>
            <Row gutter={gutter}>
                <Column width="9">
                    <Content>9</Content>
                </Column>
                <Column width="3">
                    <Content>3</Content>
                </Column>
            </Row>
            <Row gutter={gutter}>
                <Column width="10">
                    <Content>10</Content>
                </Column>
                <Column width="2">
                    <Content>2</Content>
                </Column>
            </Row>
            <Row gutter={gutter}>
                <Column width="11">
                    <Content>11</Content>
                </Column>
                <Column width="1">
                    <Content>1</Content>
                </Column>
            </Row>
            <Row gutter={gutter}>
                <Column width="12">
                    <Content>12</Content>
                </Column>
            </Row>
        </>
    );
}
