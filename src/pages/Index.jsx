import React, { useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Text, VStack, ListItem, UnorderedList, IconButton, useToast } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus, FaDownload } from "react-icons/fa";

const Index = () => {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    date: "",
    amount: "",
    type: "income",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const addTransaction = () => {
    if (editingId !== null) {
      setTransactions(transactions.map((transaction) => (transaction.id === editingId ? { ...transaction, ...form, id: editingId } : transaction)));
      setEditingId(null);
    } else {
      setTransactions([...transactions, { ...form, id: Date.now() }]);
    }
    setForm({ date: "", amount: "", type: "income", category: "" });
  };

  const editTransaction = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    setForm({ ...transaction });
    setEditingId(id);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    toast({
      title: "Transaction deleted.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  const applyFilters = () => {
    return transactions.filter((transaction) => {
      return (filters.type ? transaction.type === filters.type : true) && (filters.category ? transaction.category === filters.category : true) && (filters.startDate ? new Date(transaction.date) >= new Date(filters.startDate) : true) && (filters.endDate ? new Date(transaction.date) <= new Date(filters.endDate) : true);
    });
  };

  const getTotalBalance = () => {
    return transactions
      .reduce((acc, transaction) => {
        return transaction.type === "income" ? acc + parseFloat(transaction.amount) : acc - parseFloat(transaction.amount);
      }, 0)
      .toFixed(2);
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transactions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" mb={5}>
        <Text fontSize="2xl">Budgeting App</Text>
        <Button leftIcon={<FaDownload />} onClick={exportToJson}>
          Export JSON
        </Button>
      </Flex>
      <VStack spacing={4} align="flex-start">
        <FormControl id="date">
          <FormLabel>Date</FormLabel>
          <Input type="date" name="date" value={form.date} onChange={handleInputChange} />
        </FormControl>
        <FormControl id="amount">
          <FormLabel>Amount</FormLabel>
          <Input type="number" name="amount" value={form.amount} onChange={handleInputChange} />
        </FormControl>
        <FormControl id="type">
          <FormLabel>Type</FormLabel>
          <Select name="type" value={form.type} onChange={handleInputChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </FormControl>
        <FormControl id="category">
          <FormLabel>Category</FormLabel>
          <Select name="category" value={form.category} onChange={handleInputChange}>
            <option value="">Select Category</option>
            <option value="groceries">Groceries</option>
            <option value="bills">Bills</option>
            <option value="salary">Salary</option>
          </Select>
        </FormControl>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={addTransaction}>
          {editingId ? "Update Transaction" : "Add Transaction"}
        </Button>
      </VStack>
      <Box mt={10}>
        <Text fontSize="xl">Filters</Text>
        <Flex>
          <FormControl id="filterType">
            <FormLabel>Type</FormLabel>
            <Select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </FormControl>
          <FormControl id="filterCategory">
            <FormLabel>Category</FormLabel>
            <Select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="groceries">Groceries</option>
              <option value="bills">Bills</option>
              <option value="salary">Salary</option>
            </Select>
          </FormControl>
          <FormControl id="startDate">
            <FormLabel>Start Date</FormLabel>
            <Input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          </FormControl>
          <FormControl id="endDate">
            <FormLabel>End Date</FormLabel>
            <Input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
          </FormControl>
        </Flex>
      </Box>
      <Box mt={5}>
        <Text fontSize="xl">Transactions</Text>
        <UnorderedList>
          {applyFilters().map((transaction) => (
            <ListItem key={transaction.id} mb={2}>
              <Flex alignItems="center" justifyContent="space-between">
                <Text>{`${transaction.date} - ${transaction.category} - ${transaction.type} - $${transaction.amount}`}</Text>
                <Box>
                  <IconButton aria-label="Edit" icon={<FaEdit />} mr={2} onClick={() => editTransaction(transaction.id)} />
                  <IconButton aria-label="Delete" icon={<FaTrash />} colorScheme="red" onClick={() => deleteTransaction(transaction.id)} />
                </Box>
              </Flex>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
      <Flex justifyContent="space-between" mt={10}>
        <Text fontSize="2xl">Total Balance: ${getTotalBalance()}</Text>
      </Flex>
    </Box>
  );
};

export default Index;
