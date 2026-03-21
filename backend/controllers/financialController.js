const Project = require('../models/Project');

exports.getFinancialData = async (req, res) => {
  try {
    const projects = await Project.find();

    // Calculate financial metrics
    const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
    const totalExpenses = projects.reduce((sum, project) => sum + project.expenses, 0);
    const totalExpenseInterest = projects.reduce((sum, project) => sum + project.expenseInterest, 0);
    const remainingBudget = totalBudget - totalExpenses;
    const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    // For recent transactions, we'll need a Transaction model or similar
    // For now, we'll return placeholder data
    const recentTransactions = projects.flatMap(project => ({
      id: project._id,
      date: project.updatedAt,
      description: `Expenses for ${project.name}`,
      amount: `$${project.expenses}`,
      category: 'Project Expenses',
      status: project.status,
    }));

    res.json({
      totalBudget: `$${totalBudget.toLocaleString()}`,
      spent: `$${totalExpenses.toLocaleString()}`,
      remaining: `$${remainingBudget.toLocaleString()}`,
      expenseInterest: `$${totalExpenseInterest.toLocaleString()}`,
      budgetUtilization: `${budgetUtilization.toFixed(1)}%`,
      expenses: recentTransactions,
    });
  } catch (error) {
    console.error('Error in getFinancialData:', error);
    res.status(500).json({ message: error.message });
  }
};