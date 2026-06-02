/* eslint-disable no-alert */
// @ts-nocheck
import React, { useState, useMemo } from 'react';
import isNil from 'lodash-es/isNil';
import Menu, {
    MenuButton,
    MenuLink,
    MenuText,
    MenuRemovable,
    MenuCheck,
    SubMenu,
} from '@reformjs/reactive/controls/menu';
import { AnchorButton } from '@reformjs/reactive/arrangement/drop-down';

function alertThem({ data }) {
    alert(!isNil(data) ? data : 'Clicked');
}

function handleRemove({ data }) {
    alert(!isNil(data) ? data : 'Removed');
}

function example({ design, icon } = {}) {
    const [checkedGroupValue, setCheckedGroup] = useState(false);
    const [checkedValue, setChecked] = useState(false);

    const checkedGroup = useMemo(
        () => ({
            onChange: setCheckedGroup,
            value: checkedGroupValue,
        }),
        [checkedGroupValue],
    );

    return (
        <Menu
            Anchor={AnchorButton}
            anchorProps={{
                children: 'Text',
                variant: 'fill',
            }}
            design={design}
        >
            <MenuButton icon={icon} onClick={alertThem}>
                Button
            </MenuButton>
            <MenuLink icon={icon} href="www.apple.com">
                Link
            </MenuLink>
            <MenuText icon={icon}>Just Some Text</MenuText>
            <MenuRemovable icon={icon} onRemove={handleRemove}>
                Removable
            </MenuRemovable>
            <SubMenu content="Sub Menu" icon={icon}>
                <MenuButton icon={icon} onClick={alertThem}>
                    Button
                </MenuButton>
                <MenuLink icon={icon} href="www.apple.com">
                    Link
                </MenuLink>
                <MenuText icon={icon}>Just Some Text</MenuText>
                <MenuRemovable icon={icon} onRemove={handleRemove}>
                    Removable
                </MenuRemovable>
                <MenuCheck
                    value={checkedValue}
                    onChange={setChecked}
                    icon={icon}
                >
                    Check
                </MenuCheck>
            </SubMenu>
            <SubMenu
                content="Sub Menu With Check"
                checkbox={checkedGroup}
                icon={icon}
            >
                <MenuButton icon={icon} onClick={alertThem}>
                    Button
                </MenuButton>
                <MenuLink icon={icon} href="www.apple.com">
                    Link
                </MenuLink>
                <MenuText icon={icon}>Just Some Text</MenuText>
                <MenuRemovable icon={icon} onRemove={handleRemove}>
                    Removable
                </MenuRemovable>
                <MenuCheck
                    value={checkedValue}
                    onChange={setChecked}
                    icon={icon}
                >
                    Check
                </MenuCheck>
            </SubMenu>
            <MenuCheck value={checkedValue} onChange={setChecked} icon={icon}>
                Check
            </MenuCheck>
        </Menu>
    );
}

export default example;
