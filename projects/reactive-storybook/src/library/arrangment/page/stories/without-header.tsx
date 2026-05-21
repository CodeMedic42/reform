/* eslint-disable no-alert */
// @ts-nocheck
import React, { useCallback } from 'react';
import { faHome } from '@audacious/icons/solid/faHome';
import { faUser } from '@audacious/icons/solid/faUser';
import { faEnvelope } from '@audacious/icons/solid/faEnvelope';
import { faGear } from '@audacious/icons/solid/faGear';
import Page from '..';
import PageContainer from '../page-container';
import { Row, Column } from '../../grid';
import TextInput from '../../text-input';
import { ColumnBackground } from '../../grid/stories/grid-scope';
import { Table } from '../../table';
import aiLogo from '../page-logo/stories/assets/audacious-inquiry-logo.png';

function example() {
	const [selected, setSelected] = React.useState('home');

	const appMenuOptions = [
		{
			id: 'home',
			icon: faHome,
			label: 'Home',
			onClick: useCallback(() => setSelected('home')),
		},
		{
			id: 'user',
			icon: faUser,
			label: 'User',
			onClick: useCallback(() => setSelected('user')),
		},
		{
			id: 'settings',
			icon: faGear,
			label: 'Settings',
			menuOptions: [
				{
					id: 'general',
					label: 'General',
					menuOptions: [
						{
							id: 'localization',
							label: 'Localization',
							onClick: useCallback(() =>
								setSelected('settings/general'),
							),
						},
						{
							id: 'rules',
							label: 'Rules',
							onClick: useCallback(() =>
								setSelected('settings/eula'),
							),
						},
					],
				},
				{
					id: 'eula',
					label: 'EULA',
					onClick: useCallback(() => setSelected('settings/eula')),
				},
			],
		},
	];

	const sysMenuOptions = [
		{
			id: 'message',
			icon: faEnvelope,
			label: 'Message',
		},
	];

	function createItem(index) {
		const item = {};

		for (let counter = 0; counter < 10; counter += 1) {
			item[`foo${counter}`] = `foo${index}${counter + 1}`;
		}

		return item;
	}

	function createItems(count) {
		const data = [];

		for (let counter = 0; counter < count; counter += 1) {
			data[counter] = createItem(counter);
		}

		return data;
	}

	function createColumns() {
		const data = [];

		for (let counter = 0; counter < 10; counter += 1) {
			data[counter] = {
				headerBody: `Foo ${counter + 1}`,
				cellValuePath: `foo${counter}`,
				width: '235px',
			};
		}

		return data;
	}

	const items = createItems(30);
	const columns = createColumns();

	return (
		<Page
			id="example"
			userActions={[
				{
					label: 'Reset Password',
					onClick: () => alert('Reset Password Click'),
				},
			]}
			userName={{
				firstName: 'Example',
			}}
			applications={[
				{
					label: 'Apple',
					url: 'www.apple.com',
				},
				{
					label: 'Google',
					url: 'www.google.com',
				},
			]}
			additionalFeatures={[<span key="1">Test</span>, <span key="2">Test</span>]}
			headerLogo={{
				urlHref: 'https://testapp.dev-ainqapps.com',
				imageSource: aiLogo,
			}}
			breadcrumbs={[
				{
					label: 'Foo',
					route: 'example/foo',
				},
				{
					label: 'Bar',
					route: 'example/bar',
				},
			]}
			pageName="Page Name"
			appName="Application Name"
			onGoto={(route) => {
				alert(`Navigating to ${route}`);
			}}
			variant="grey"
			appMenuOptions={appMenuOptions}
			sysMenuOptions={sysMenuOptions}
			selectedPath={selected}
			onMenuSelect={setSelected}
			platformMessage="Powered By Audacious"
			hideHeader
		>
			<PageContainer sticky>
				<ColumnBackground />
				<Row gutter>
					<Column>
						<TextInput label="Example" />
						<div
							style={{
								height: '100px',
							}}
						/>
					</Column>
				</Row>
			</PageContainer>
			<Table
				items={items}
				columns={columns}
				minWidth={1065}
				pageTable
				stickyColumns={2}
				alwaysShowHeaders
				useParentScroll
			/>
		</Page>
	);
}

example.story = {
	name: 'Without Header',
};

export default example;
