import React, { useState } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import AdminInventoryDashboard from './AdminInventoryDashboard';
import AdminInventoryList from './AdminInventoryList';
import ErrorBoundary from '../../ErrorBoundary';

const AdminInventory = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <ErrorBoundary>
      <Box>
        <Tabs index={tabIndex} onChange={setTabIndex}>
          <TabList>
            <Tab>Dashboard</Tab>
            <Tab>Inventory List</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <AdminInventoryDashboard />
            </TabPanel>
            <TabPanel>
              <AdminInventoryList />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ErrorBoundary>
  );
};

export default AdminInventory; 