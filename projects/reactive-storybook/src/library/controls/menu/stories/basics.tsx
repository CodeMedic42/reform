/* eslint-disable no-alert */
// @ts-nocheck
import React from 'react';
import isNil from 'lodash-es/isNil';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import Menu, { MenuButton, SubMenu } from '@reformjs/reactive/controls/menu';
import { AnchorButton } from '@reformjs/reactive/arrangement/drop-down';
import Scope from './scope';
import commonExample from './example';

function alertThem({ data }) {
    alert(!isNil(data) ? data : 'Clicked');
}

const tallMenuList = Array.from({ length: 40 }, (value, index) => (
    <MenuButton key={index} onClick={alertThem}>
        Button
    </MenuButton>
));

function example() {
    return (
        <>
            <Scope title="Basic Example">{commonExample()}</Scope>
            <Scope title="With icon">{commonExample({ icon: faGear })}</Scope>
            <Scope title="Menu item with border">
                <Menu
                    Anchor={AnchorButton}
                    anchorProps={{
                        children: 'Text',
                variant: 'fill',
                    }}
                >
                    <MenuButton borderBottom onClick={alertThem}>
                        Button
                    </MenuButton>
                    <MenuButton onClick={alertThem}>Button</MenuButton>
                    <MenuButton onClick={alertThem}>Button</MenuButton>
                    <MenuButton borderTop onClick={alertThem}>
                        Button
                    </MenuButton>
                </Menu>
            </Scope>
            <Scope title="With sub menus">
                <Menu
                    Anchor={AnchorButton}
                    anchorProps={{
                        children: 'Text',
                variant: 'fill',
                    }}
                >
                    <MenuButton onClick={alertThem}>Button</MenuButton>
                    <MenuButton onClick={alertThem}>Button</MenuButton>
                    <SubMenu content="Sub Menu">
                        <MenuButton onClick={alertThem}>Button</MenuButton>
                        <MenuButton onClick={alertThem}>Button</MenuButton>
                        <SubMenu content="Sub Menu">
                            <MenuButton onClick={alertThem}>Button</MenuButton>
                            <MenuButton onClick={alertThem}>Button</MenuButton>
                        </SubMenu>
                    </SubMenu>
                    <MenuButton onClick={alertThem}>Button</MenuButton>
                    <SubMenu content="Sub Menu">
                        <MenuButton onClick={alertThem}>Button</MenuButton>
                        <MenuButton onClick={alertThem}>Button</MenuButton>
                    </SubMenu>
                </Menu>
            </Scope>
            <Scope title="With tall menus">
                <Menu
                    Anchor={AnchorButton}
                    anchorProps={{
                        children: 'Text',
                variant: 'fill',
                    }}
                >
                    {tallMenuList}
                    <SubMenu content="Sub Menu">
                        {tallMenuList}
                        <SubMenu content="Sub Menu">{tallMenuList}</SubMenu>
                    </SubMenu>
                </Menu>
            </Scope>
        </>
    );
}

example.storyName = 'Basics';

export default example;
