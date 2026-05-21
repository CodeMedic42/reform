/* eslint-disable no-alert */
// @ts-nocheck
import React, { useState } from 'react';
import { faHome } from '@audacious/icons/solid/faHome';
import { faUser } from '@audacious/icons/solid/faUser';
import { faEnvelope } from '@audacious/icons/solid/faEnvelope';
import { faGear } from '@audacious/icons/solid/faGear';
import Page from '..';
import Link from '../../link';
import PageTitle from '../page-title';
import PageContainer from '../page-container';
import aiLogo from '../page-logo/stories/assets/audacious-inquiry-logo.png';
import { Text } from '../../typography';

const tabs = [
	{
		id: 'a',
		heading: 'Tab A',
	},
	{
		id: 'b',
		heading: 'Tab B',
	},
	{
		id: 'c',
		heading: 'Tab C',
	},
	{
		id: 'd',
		heading: 'Tab D',
		disabled: true,
	},
];

const appMenuOptions = [
	{
		id: 'home',
		icon: faHome,
		label: 'Home',
	},
	{
		id: 'user',
		icon: faUser,
		label: 'User',
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
					},
					{
						id: 'rules',
						label: 'Rules',
					},
				],
			},
			{
				id: 'eula',
				label: 'EULA',
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

const userActions = [
	{
		id: 'reset-password',
		label: 'Reset Password',
		onClick: () => alert('Reset Password Click'),
		borderBottom: true,
	},
];

function example() {
	const [selectedPath, setSelectedPath] = useState([
		'settings',
		'general',
		'rules',
	]);

	const [selectedTab, setSelectedTab] = useState('a');

	return (
		<Page
			id="example"
			userActions={userActions}
			userName={{
				firstName: 'FirstName',
				lastName: 'LastName',
			}}
			applications={[
				{
					label: 'Apple',
					href: 'www.apple.com',
				},
				{
					label: 'Google',
					href: 'www.google.com',
				},
			]}
			additionalFeatures={[<Text key="1">Test</Text>]}
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
			selectedPath={selectedPath}
			onNavigate={setSelectedPath}
			platformMessage={
				<span>
					Powered By{' '}
					<Link href="www.apple.com" underline>
						Audacious
					</Link>
				</span>
			}
			logOutAction={{
				label: 'Log Out',
				onClick: () => {},
			}}
		>
			<PageTitle
				id="example-page-title"
				pageName="Hello World"
				selectedTab={selectedTab}
				onTabSelect={setSelectedTab}
				tabs={tabs}
				customFeature={<Text>Test</Text>}
				onBack={() => alert('going back')}
				showSpinner
			/>
			<PageContainer showSpinner asCard>
				InnerText
			</PageContainer>
			<PageContainer showSpinner asCard fillPage>
				InnerText
			</PageContainer>
			<PageContainer showSpinner fillPage>
				InnerText
			</PageContainer>
		</Page>
	);
}

example.story = {
	name: 'Loading',
};

export default example;
