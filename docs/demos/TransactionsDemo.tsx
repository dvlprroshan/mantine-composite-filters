import React, { useState, useMemo } from 'react';
import { MultiFiltersInput } from 'mantine-composite-filters';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Table,
  Box,
  ThemeIcon,
  Paper,
  SimpleGrid,
  Avatar,
  Divider,
} from '@mantine/core';
import {
  IconCreditCard,
  IconArrowUpRight,
  IconArrowDownRight,
  IconCurrencyDollar,
  IconReceipt,
  IconBuildingBank,
  IconWallet,
  IconShoppingCart,
  IconHome,
  IconCar,
  IconDeviceMobile,
} from '@tabler/icons-react';
import type { ActiveFilter, FilterDefinition } from 'mantine-composite-filters';

const transactionFilters: FilterDefinition[] = [
  {
    key: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Search transactions...',
    operators: ['contains', 'starts_with', '='],
  },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'income', label: '📈 Income' },
      { value: 'expense', label: '📉 Expense' },
      { value: 'transfer', label: '🔄 Transfer' },
      { value: 'refund', label: '↩️ Refund' },
    ],
  },
  {
    key: 'category',
    label: 'Category',
    type: 'multi_select',
    options: [
      { value: 'shopping', label: '🛒 Shopping' },
      { value: 'food', label: '🍔 Food & Dining' },
      { value: 'transportation', label: '🚗 Transportation' },
      { value: 'utilities', label: '💡 Utilities' },
      { value: 'entertainment', label: '🎬 Entertainment' },
      { value: 'healthcare', label: '🏥 Healthcare' },
      { value: 'salary', label: '💼 Salary' },
      { value: 'investments', label: '📊 Investments' },
    ],
  },
  {
    key: 'amount',
    label: 'Amount ($)',
    type: 'number',
    placeholder: 'Enter amount...',
    operators: ['=', '>', '<', '>=', '<='],
    icon: <IconCurrencyDollar size={14} />,
  },
  {
    key: 'account',
    label: 'Account',
    type: 'select',
    options: [
      { value: 'checking', label: '🏦 Checking Account' },
      { value: 'savings', label: '💰 Savings Account' },
      { value: 'credit', label: '💳 Credit Card' },
      { value: 'investment', label: '📈 Investment Account' },
    ],
    icon: <IconBuildingBank size={14} />,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'completed', label: '✅ Completed' },
      { value: 'pending', label: '⏳ Pending' },
      { value: 'failed', label: '❌ Failed' },
      { value: 'cancelled', label: '🚫 Cancelled' },
    ],
  },
  {
    key: 'payment_method',
    label: 'Payment Method',
    type: 'multi_select',
    options: [
      { value: 'card', label: '💳 Card' },
      { value: 'bank_transfer', label: '🏦 Bank Transfer' },
      { value: 'paypal', label: '🅿️ PayPal' },
      { value: 'apple_pay', label: '🍎 Apple Pay' },
      { value: 'cash', label: '💵 Cash' },
    ],
  },
  {
    key: 'date',
    label: 'Transaction Date',
    type: 'date_range',
  },
];

// Mock transactions
const mockTransactions = [
  {
    id: 'TXN-8921',
    description: 'Salary Deposit - TechCorp Inc.',
    type: 'income',
    category: 'salary',
    amount: 5200,
    account: 'Checking',
    status: 'completed',
    method: 'Bank Transfer',
    date: 'Today, 9:00 AM',
    icon: <IconWallet size={18} />,
  },
  {
    id: 'TXN-8920',
    description: 'Amazon - Electronics',
    type: 'expense',
    category: 'shopping',
    amount: -299.99,
    account: 'Credit Card',
    status: 'completed',
    method: 'Card',
    date: 'Today, 2:30 PM',
    icon: <IconShoppingCart size={18} />,
  },
  {
    id: 'TXN-8919',
    description: 'Uber - Ride to Airport',
    type: 'expense',
    category: 'transportation',
    amount: -45.50,
    account: 'Checking',
    status: 'completed',
    method: 'Apple Pay',
    date: 'Yesterday',
    icon: <IconCar size={18} />,
  },
  {
    id: 'TXN-8918',
    description: 'Electric Bill - City Power',
    type: 'expense',
    category: 'utilities',
    amount: -125.00,
    account: 'Checking',
    status: 'pending',
    method: 'Bank Transfer',
    date: 'Yesterday',
    icon: <IconHome size={18} />,
  },
  {
    id: 'TXN-8917',
    description: 'Mobile Plan - Verizon',
    type: 'expense',
    category: 'utilities',
    amount: -85.00,
    account: 'Credit Card',
    status: 'completed',
    method: 'Card',
    date: '2 days ago',
    icon: <IconDeviceMobile size={18} />,
  },
  {
    id: 'TXN-8916',
    description: 'Dividend Payment - AAPL',
    type: 'income',
    category: 'investments',
    amount: 156.25,
    account: 'Investment',
    status: 'completed',
    method: 'Transfer',
    date: '3 days ago',
    icon: <IconArrowUpRight size={18} />,
  },
];

const statusColors: Record<string, string> = {
  completed: 'green',
  pending: 'yellow',
  failed: 'red',
  cancelled: 'gray',
};

export function TransactionsDemo() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const filteredTransactions = useMemo(() => {
    return filters.length > 0
      ? mockTransactions.filter((_, i) => i < Math.max(2, mockTransactions.length - filters.length))
      : mockTransactions;
  }, [filters]);

  const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const totalExpense = Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0));
  const netBalance = totalIncome - totalExpense;

  return (
    <Box p="xl" maw={1200} mx="auto">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" align="center">
              <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'green', to: 'teal' }}>
                <IconReceipt size={20} />
              </ThemeIcon>
              <Title order={2}>Financial Transactions</Title>
            </Group>
            <Text c="dimmed" size="sm" mt={4}>
              Track and filter your income, expenses, and transfers
            </Text>
          </div>
        </Group>

        {/* Summary Cards */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Income</Text>
                <Text size="xl" fw={700} c="green">${totalIncome.toLocaleString()}</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="green">
                <IconArrowUpRight size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Expenses</Text>
                <Text size="xl" fw={700} c="red">${totalExpense.toLocaleString()}</Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color="red">
                <IconArrowDownRight size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Net Balance</Text>
                <Text size="xl" fw={700} c={netBalance >= 0 ? 'green' : 'red'}>
                  {netBalance >= 0 ? '+' : ''}${netBalance.toLocaleString()}
                </Text>
              </div>
              <ThemeIcon size="xl" radius="md" variant="light" color={netBalance >= 0 ? 'green' : 'red'}>
                <IconWallet size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Filter Bar */}
        <Card withBorder p="md" radius="md">
          <MultiFiltersInput
            filters={transactionFilters}
            value={filters}
            onChange={setFilters}
            placeholder="🔍 Filter transactions by type, category, amount, date..."
            storageKeyPrefix="finance-transactions"
          />
        </Card>

        {/* Transactions Table */}
        <Card withBorder p={0} radius="md">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Transaction</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Account</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th ta="right">Amount</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredTransactions.map((txn) => (
                <Table.Tr key={txn.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <ThemeIcon 
                        variant="light" 
                        color={txn.amount > 0 ? 'green' : 'gray'} 
                        radius="xl"
                      >
                        {txn.icon}
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={500}>{txn.description}</Text>
                        <Text size="xs" c="dimmed">{txn.date} · {txn.id}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="gray" size="sm">
                      {txn.category}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{txn.account}</Text>
                    <Text size="xs" c="dimmed">{txn.method}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[txn.status]} variant="dot" size="sm">
                      {txn.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text 
                      fw={600} 
                      c={txn.amount > 0 ? 'green' : 'dark'}
                    >
                      {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString()}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        {filteredTransactions.length === 0 && (
          <Card withBorder p="xl" ta="center">
            <IconReceipt size={48} color="gray" style={{ margin: '0 auto' }} />
            <Text size="lg" fw={500} mt="md">No transactions found</Text>
            <Text c="dimmed" size="sm">Adjust your filters to see transactions</Text>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
