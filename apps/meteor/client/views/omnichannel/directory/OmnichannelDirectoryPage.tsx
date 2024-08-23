import { Tabs } from '@rocket.chat/fuselage';
import { useRouteParameter, usePermission, useTranslation, useRouter } from '@rocket.chat/ui-contexts';
import type { ReactElement } from 'react';
import React, { useEffect, useCallback } from 'react';

import { ContextualbarDialog } from '../../../components/Contextualbar';
import { Page, PageHeader, PageContent } from '../../../components/Page';
import { queryClient } from '../../../lib/queryClient';
import NotAuthorizedPage from '../../notAuthorized/NotAuthorizedPage';
import ContextualBar from './ContextualBar';
import CallTab from './calls/CallTab';
import ChatTab from './chats/ChatTab';
import ContactTab from './contacts/ContactTab';

const DEFAULT_TAB = 'contacts';

const OmnichannelDirectoryPage = (): ReactElement => {
	const t = useTranslation();
	const router = useRouter();
	const page = useRouteParameter('page');
	const bar = useRouteParameter('bar');
	const canViewDirectory = usePermission('view-omnichannel-contact-center');

	useEffect(
		() =>
			router.subscribeToRouteChange(() => {
				if (router.getRouteName() !== 'omnichannel-directory' || !!router.getRouteParameters().page) {
					return;
				}

				router.navigate({
					name: 'omnichannel-directory',
					params: { page: DEFAULT_TAB },
				});
			}),
		[router],
	);

	const handleTabClick = useCallback((tab) => () => router.navigate({ name: 'omnichannel-directory', params: { tab } }), [router]);

	const chatReload = () => queryClient.invalidateQueries({ queryKey: ['current-chats'] });

	if (!canViewDirectory) {
		return <NotAuthorizedPage />;
	}

	return (
		<Page flexDirection='row'>
			<Page>
				<PageHeader title={t('Omnichannel_Contact_Center')} />
				<Tabs flexShrink={0}>
					<Tabs.Item selected={page === 'contacts'} onClick={handleTabClick('contacts')}>
						{t('Contacts')}
					</Tabs.Item>
					<Tabs.Item selected={page === 'chats'} onClick={handleTabClick('chats')}>
						{t('Chats')}
					</Tabs.Item>
					<Tabs.Item selected={page === 'calls'} onClick={handleTabClick('calls')}>
						{t('Calls')}
					</Tabs.Item>
				</Tabs>
				<PageContent>
					{(page === 'contacts' && <ContactTab />) || (page === 'chats' && <ChatTab />) || (page === 'calls' && <CallTab />)}
				</PageContent>
			</Page>
			{bar && (
				<ContextualbarDialog>
					<ContextualBar chatReload={chatReload} />
				</ContextualbarDialog>
			)}
		</Page>
	);
};

export default OmnichannelDirectoryPage;
