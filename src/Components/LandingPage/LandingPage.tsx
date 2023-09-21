import './LandingPage.scss';

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Popover, Tab, TabAction, Tabs, TabTitleText, Text, TextContent } from '@patternfly/react-core';
import { ExternalLinkAltIcon, HelpIcon } from '@patternfly/react-icons';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import InventoryPage from '../InventoryPage/InventoryPage';
import TasksPage from '../TasksPage/TasksPage';

/**
 * Landing page for Upgrades App page on Insights.
 * Contains simple page with title and tab structure.
 */
export const LandingPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabsPath = ['', 'pre-upgrade', 'remediations', 'upgrade', 'post-upgrade'];

  const tabPath = pathname.split('/').pop() || '';
  const initialActiveTabKey = tabsPath.indexOf(tabPath) >= 0 ? tabsPath.indexOf(tabPath) : 0;
  const [activeTabKey, setActiveTabKey] = useState(initialActiveTabKey);
  const [selectedSystems, setSelectedSystems] = useState([] as string[]);

  useEffect(() => {
    insights?.chrome?.appAction?.('upgrades');
  }, []);

  useEffect(() => {
    setActiveTabKey(initialActiveTabKey);
  }, [pathname]);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: number | string) => {
    if (typeof tabIndex === 'string') tabIndex = Number(tabIndex);
    const tabPath = tabsPath[tabIndex];
    if (tabPath !== undefined) {
      navigate(tabPath);
    }
    setActiveTabKey(tabIndex);
  };

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle className="title" title="Upgrades" />
        <Popover
          minWidth="35rem"
          headerContent={'About upgrades'}
          bodyContent={
            <TextContent>
              <Text>
                This page helps perform an in-place upgrade of Red Hat Enterprise Linux. Separate tabs represents different phases user should go
                through in order to succesfully upgrade system(s) to next major release.
              </Text>
              <Text>
                <Button
                  component="a"
                  target="_blank"
                  variant="link"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  isInline
                  href={'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/upgrading_from_rhel_7_to_rhel_8/index'}
                >
                  Upgrading from RHEL 7 to RHEL 8
                </Button>
              </Text>
              <Text>
                <Button
                  component="a"
                  target="_blank"
                  variant="link"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  isInline
                  href={'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/upgrading_from_rhel_8_to_rhel_9/index'}
                >
                  Upgrading from RHEL 8 to RHEL 9
                </Button>
              </Text>
            </TextContent>
          }
        >
          <Button variant="plain" aria-label="About upgrades" className="pf-u-pl-sm header-button">
            <HelpIcon />
          </Button>
        </Popover>
      </PageHeader>
      <Tabs className="pf-c-tabs pf-c-page-header pf-c-table" activeKey={activeTabKey} onSelect={handleTabClick}>
        <Tab
          eventKey={0}
          title={<TabTitleText>Inventory</TabTitleText>}
          actions={
            // NOTE: Example of Help Popover - Update in OAMG-9571
            <HelpPopover
              header={'Inventory'}
              body={
                <div>
                  <TextContent>
                    <Text>Systems that are eligible for in-place upgrade using leapp utility.</Text>
                    <Text>Systems have to be on supported upgrade paths</Text>
                  </TextContent>
                </div>
              }
            />
          }
        >
          <section className="pf-l-page__main-section pf-c-page__main-section">
            <InventoryPage selectedIds={selectedSystems} setSelectedIds={setSelectedSystems} />
          </section>
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Pre-upgrade</TabTitleText>}>
          <section className="pf-l-page__main-section pf-c-page__main-section">
            <TasksPage slug={'leapp-preupgrade'} />
          </section>
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Remediations</TabTitleText>}>
          <section className="pf-l-page__main-section pf-c-page__main-section">TODO: Content Remediations</section>
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Upgrade</TabTitleText>}>
          <section className="pf-l-page__main-section pf-c-page__main-section">
            <TasksPage slug={'leapp-upgrade'} />
          </section>
        </Tab>
        <Tab eventKey={4} isDisabled title={<TabTitleText>Post-upgrade</TabTitleText>}>
          <section className="pf-l-page__main-section pf-c-page__main-section">TODO: Content Post-upgrade</section>
        </Tab>
      </Tabs>
    </React.Fragment>
  );
};

type HelpPopoverPropTypes = {
  header: string;
  body: React.ReactNode;
};

const HelpPopover = ({ header, body }: HelpPopoverPropTypes) => {
  const ref = React.createRef<HTMLElement>();
  return (
    <>
      <TabAction ref={ref}>
        <HelpIcon />
      </TabAction>
      <Popover minWidth="35rem" headerContent={header} bodyContent={body} triggerRef={ref} />
    </>
  );
};

export default LandingPage;
