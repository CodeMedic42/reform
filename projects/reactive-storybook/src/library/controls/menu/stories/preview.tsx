// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import Menu, {
    MenuButton,
    MenuLink,
    MenuText,
    MenuRemovable,
    MenuCheck,
    SubMenu,
} from '@reformjs/reactive/controls/menu';
import { AnchorButton } from '@reformjs/reactive/arrangement/drop-down';
import Scope from './scope';

function renderMenuButton({ menuItemType, icon, label }) {
    if (menuItemType !== 'Button') {
        return null;
    }

    return <MenuButton
        icon={icon}
        eventData='Clicked'
        // eslint-disable-next-line no-alert
        onClick={({ data }) => { alert(data) }}
    >
        {label}
    </MenuButton>;
}

function renderMenuLink({ menuItemType, icon, label, href, target, rel }) {
    if (menuItemType !== 'Link') {
        return null;
    }

    return (
        <MenuLink icon={icon} href={href} target={target} rel={rel}>
            {label}
        </MenuLink>
    );
}

function renderMenuText({ menuItemType, icon, label }) {
    if (menuItemType !== 'Text') {
        return null;
    }

    return <MenuText icon={icon}>{label}</MenuText>;
}

function renderMenuRemovable({ menuItemType, icon, label }) {
    if (menuItemType !== 'Removable') {
        return null;
    }

    return <MenuRemovable
        icon={icon}
        eventData='Removed'
        // eslint-disable-next-line no-alert
        onRemove={({ data }) => { alert(data) }}
    >
        {label}
    </MenuRemovable>;
}

function renderMenuCheck({ menuItemType, icon, label, checkedGroup }) {
    if (menuItemType !== 'Check') {
        return null;
    }

    return (
        <MenuCheck
            {...checkedGroup}
            icon={icon}
        >
            {label}
        </MenuCheck>
    );
}

function renderSubMenu({
    menuItemType,
    icon,
    label,
    checkedGroup,
    enableCheckbox,
}) {
    if (menuItemType !== 'SubMenu') {
        return null;
    }

    return (
        <SubMenu
            content={label}
            icon={icon}
            checkbox={enableCheckbox ? checkedGroup : null}
        >
            <MenuButton>Button</MenuButton>
            <SubMenu content="Another Menu">
                <MenuButton>Button</MenuButton>
                <MenuButton>Button</MenuButton>
            </SubMenu>
            <MenuButton>Button</MenuButton>
        </SubMenu>
    );
}

function example(props) {
    const {
        id,
        className,
        enableIcon,
        design,
        menuItemType,
        label,
        href,
        target,
        rel,
        'checkbox.variant': checkboxVariant,
        'checkbox.disabled': checkboxDisabled,
        'subMenu.enabledCheckbox': enableCheckbox,
    } = props;

    const [checkedValue, setChecked] = useState(false);

    const checkedGroup = useMemo(
        () => ({
            onChange: setChecked,
            value: checkedValue,
            variant: checkboxVariant,
            disabled: checkboxDisabled,
            color: 'success',
        }),
        [checkedValue, checkboxVariant, checkboxDisabled],
    );

    const finalProps = useMemo(
        () => ({
            menuItemType,
            label,
            checkedGroup,
            href,
            target,
            rel,
            icon: enableIcon ? faGear : null,
            enableCheckbox,
        }),
        [menuItemType, label, checkedGroup, href, target, rel, enableIcon, enableCheckbox],
    );

    return (
        <Scope fillViewport>
            <Menu
                id={id}
                className={className}
                Anchor={AnchorButton}
                anchorProps={{
                    children: 'Text',
                    variant: 'fill',
                }}
                design={design}
            >
                {renderMenuButton(finalProps)}
                {renderMenuLink(finalProps)}
                {renderMenuText(finalProps)}
                {renderMenuRemovable(finalProps)}
                {renderMenuCheck(finalProps)}
                {renderSubMenu(finalProps)}
            </Menu>
        </Scope>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.args = {
    menuItemType: 'Button',
    id: 'text',
    className: 'text',
    label: 'Item Text',
    enableIcon: false,
    'subMenu.enabledCheckbox': false,
};
example.argTypes = {
    menuItemType: {
        control: { type: 'select' },
        options: [
            'Button',
            'Link',
            'Text',
            'Removable',
            'Check',
            'SubMenu',
        ],
    },
    id: {
        control: 'text',
    },
    className: {
        control: 'text',
    },
    label: {
        control: 'text',
    },
    enableIcon: {
        control: 'boolean',
    },
    href: {
        control: 'text',
        if: { arg: 'menuItemType', eq: 'Link' },
    },
    target: {
        options: ['_self', '_blank', '_parent', '_top'],
        control: { type: 'select' },
        if: { arg: 'menuItemType', eq: 'Link' },
    },
    rel: {
        control: 'text',
        if: { arg: 'menuItemType', eq: 'Link' },
    },
    'subMenu.enabledCheckbox': {
        control: 'boolean',
        if: { arg: 'menuItemType', eq: 'SubMenu' },
    },
    design: {
        control: { type: 'text' },
    },
    'checkbox.variant': {
        options: ['check', 'indeterminate'],
        control: { type: 'select' },
        description: 'The style to render the Checkbox as.',
    },
    'checkbox.disabled': {
        control: { type: 'boolean' },
    },
    eventData: { table: { disable: true } },
    Anchor: { table: { disable: true } },
    anchorProps: { table: { disable: true } },
    children: { table: { disable: true } },
    onClick: { table: { disable: true } },
};

export default example;
