/* eslint-disable no-alert */
// @ts-nocheck
import React, { useCallback, useState } from 'react';
import { faHome } from '@audacious/icons/solid/faHome';
import { faUser } from '@audacious/icons/solid/faUser';
import { faEnvelope } from '@audacious/icons/solid/faEnvelope';
import { faExclamationCircle } from '@audacious/icons/solid/faExclamationCircle';
import { faGear } from '@audacious/icons/solid/faGear';
import noop from 'lodash-es/noop';
import Page from '..';
import Link from '../../link';
import PageContainer from '../page-container';
import PageTitle from '../page-title';
import PageContainerGroup from '../page-container-group';
import AlertMessage from '../../alert-message';
import { Container, Row, Column } from '../../grid';
import MultiSelectInput from '../../multi-select-input';
import { Table } from '../../table';
import aiLogo from '../page-logo/stories/assets/audacious-inquiry-logo.png';
import { Text } from '../../typography';
import { textOnly } from '../../../common/storybook/options-data';
import Drawer from '../../drawer';
import Button from '../../button';
import Document from '../../document';
import DocumentHeader from '../../document/document-header';
import DocumentBody from '../../document/document-body';
import DocumentFooter from '../../document/document-footer';
import ButtonGroup from '../../button-group';

const allRows = [];

for (let counter = 0; counter < 100; counter += 1) {
	allRows.push(<p key={counter}>{`Row ${counter + 1}`}</p>);
}

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

const breadcrumbs = [
	{
		label: 'Crumb 1',
		route: 'crumb1',
		onClick: alert,
	},
	{
		label: 'Crumb 2',
		route: 'crumb2',
		onClick: alert,
	},
	{
		label: 'Crumb 3',
		route: 'crumb3',
		onClick: alert,
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

	for (let counter = 0; counter < 5; counter += 1) {
		data[counter] = {
			headerBody: `Foo ${counter + 1}`,
			cellValuePath: `foo${counter}`,
			width: '235px',
		};
	}

	return data;
}

const items = createItems(40);
const columns = createColumns();

const applications = [
	{
		label: 'Apple',
		href: 'www.apple.com',
	},
	{
		label: 'Google',
		href: 'www.google.com',
	},
];

function example() {
	const [selectedPath, setSelectedPath] = useState([
		'settings',
		'general',
		'rules',
	]);

	const [values, setValues] = useState(null);
	const [open, setOpen] = useState(false);

	const [selectedTab, setSelectedTab] = useState('a');

	const openDrawer = useCallback(() => {
		setOpen(true);
	});

	const closeDrawer = useCallback(() => {
		setOpen(false);
	});

	return (
		<Page
			id="example"
			userActions={userActions}
			userName={{
				firstName: 'FirstName',
				lastName: 'LastName',
			}}
			applications={applications}
			additionalFeatures={[<Text key="1">Test</Text>]}
			headerLogo={{
				urlHref: 'https://testapp.dev-ainqapps.com',
				imageSource: aiLogo,
			}}
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
				breadcrumbs={breadcrumbs}
				pageName="Hello World"
				selectedTab={selectedTab}
				onTabSelect={setSelectedTab}
				tabs={tabs}
				customFeature={<Text>Test</Text>}
				onBack={() => alert('going back')}
			/>
			<PageContainer asCard>
				<AlertMessage
					color="danger"
					icon={faExclamationCircle}
					message="Hello."
					size="xs"
					className="review-panel-remove-alert"
					action={{
						label: 'Remove Error Records',
						onClick: noop,
					}}
				/>
				<Row gutter>
					<Column width="fill">
						<MultiSelectInput
							label="Example"
							expandable
							options={textOnly}
							value={values}
							onChange={setValues}
						/>
					</Column>
					<Column width="content">
						<Button
							variant="fill"
							color="primary"
							onClick={openDrawer}
						>
							Open Drawer
						</Button>
					</Column>
				</Row>
			</PageContainer>
			<PageContainer asCard>
				<Row gutter>
					<Column>
						<MultiSelectInput
							label="Example"
							expandable
							options={textOnly}
							value={values}
							onChange={setValues}
						/>
					</Column>
				</Row>
			</PageContainer>
			<PageContainer>
				<Row gutter>
					<Column>
						<MultiSelectInput
							label="Example"
							expandable
							options={textOnly}
							value={values}
							onChange={setValues}
						/>
					</Column>
				</Row>
			</PageContainer>
			<PageContainer allowScroll asCard showSpinner>
				<PageContainerGroup>
					<Container bottomGutter="16">
						<Row gutter>
							<Column>
								<MultiSelectInput
									label="Example"
									expandable
									options={textOnly}
									value={values}
									onChange={setValues}
								/>
							</Column>
						</Row>
					</Container>
				</PageContainerGroup>
				<Table
					items={items}
					columns={columns}
					minWidth={1065}
					pageTable
					stickyColumns={2}
					alwaysShowHeaders
					useParentScroll
				/>
			</PageContainer>
			<PageContainer allowScroll asCard>
				<Table
					items={items}
					columns={columns}
					minWidth={1065}
					pageTable
					stickyColumns={2}
					alwaysShowHeaders
					useParentScroll
				/>
			</PageContainer>
			<Drawer
				open={open}
				size="md"
				variant="right"
				onClose={closeDrawer}
				enableCloseOnOffClick={['.ra-btn']}
				disableBackdrop
				enableAnimation
			>
				<Document size="md">
					<DocumentHeader>
						<span>Document Header</span>
					</DocumentHeader>
					<DocumentBody>
						<div>{allRows}</div>
					</DocumentBody>
					<DocumentFooter>
						<ButtonGroup>
							<Button
								color="primary"
								variant="fill"
								onClick={closeDrawer}
							>
								Save
							</Button>
							<Button
								color="primary"
								variant="opaque"
								onClick={closeDrawer}
							>
								Cancel
							</Button>
						</ButtonGroup>
					</DocumentFooter>
				</Document>
			</Drawer>
		</Page>
	);
}

example.story = {
	name: 'Basic',
};

export default example;
