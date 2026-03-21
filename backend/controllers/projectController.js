const Project = require('../models/Project');
const mongoose = require('mongoose');

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('teamMembers', 'name email')
      .populate('createdBy', 'name email');
    res.json(projects);
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('teamMembers', 'name email')
      .populate('createdBy', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    
    // Handle file uploads
    const attachments = req.files ? req.files.map(file => `/uploads/projects/${file.filename}`) : [];

    const project = new Project({
      ...req.body,
      attachments,
      createdBy: req.user._id,
      teamMembers: req.body.teamMembers ? JSON.parse(req.body.teamMembers) : []
    });

    const newProject = await project.save();
    
    // Populate references before sending response
    const populatedProject = await Project.findById(newProject._id)
      .populate('teamMembers', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => `/uploads/projects/${file.filename}`);
      req.body.attachments = [...(project.attachments || []), ...newAttachments];
    }

    // Parse teamMembers if it's a string
    if (req.body.teamMembers && typeof req.body.teamMembers === 'string') {
      req.body.teamMembers = JSON.parse(req.body.teamMembers);
    }

    Object.assign(project, req.body);
    await project.save();

    // Populate references before sending response
    const updatedProject = await Project.findById(project._id)
      .populate('teamMembers', 'name email')
      .populate('createdBy', 'name email');

    res.json(updatedProject);
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate expense interest
exports.calculateExpenseInterest = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Calculate time in years since the last interest calculation or project start
    const referenceDate = project.interestCalculatedAt || project.startDate;
    const timeInYears = (new Date() - new Date(referenceDate)) / (1000 * 60 * 60 * 24 * 365);

    // Calculate interest: Interest = Expenses * Rate * Time
    const interest = project.expenses * project.interestRate * timeInYears;
    project.expenseInterest = (project.expenseInterest || 0) + interest;
    project.interestCalculatedAt = new Date();
    await project.save();

    res.status(200).json({ message: 'Expense interest calculated', interest });
  } catch (error) {
    console.error('Error in calculateExpenseInterest:', error);
    res.status(500).json({ message: error.message });
  }
};