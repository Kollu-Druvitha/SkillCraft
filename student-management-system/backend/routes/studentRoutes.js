// routes/studentRoutes.js
// CRUD + search operations for student records
// All routes here are protected by the auth middleware (applied in server.js)

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// @route   GET /api/students
// @desc    Get all students, or search using a "keyword" query param
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { keyword } = req.query;

    let query = {};

    // If a search keyword is provided, search across name, rollNumber and course
    if (keyword && keyword.trim() !== '') {
      const regex = new RegExp(keyword.trim(), 'i'); // case-insensitive search
      query = {
        $or: [{ name: regex }, { rollNumber: regex }, { course: regex }, { email: regex }]
      };
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('Get students error:', error.message);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
});

// @route   GET /api/students/:id
// @desc    Get a single student by id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Get student error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid student id' });
    }
    res.status(500).json({ message: 'Server error while fetching student' });
  }
});

// @route   POST /api/students
// @desc    Add a new student
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, rollNumber, email, phone, course, year, address } = req.body;

    // Basic validation
    if (!name || !rollNumber || !email || !course || !year) {
      return res.status(400).json({
        message: 'Please provide name, rollNumber, email, course and year'
      });
    }

    // Check for duplicate roll number
    const existing = await Student.findOne({ rollNumber });
    if (existing) {
      return res.status(400).json({ message: 'A student with this roll number already exists' });
    }

    const student = await Student.create({
      name,
      rollNumber,
      email,
      phone,
      course,
      year,
      address,
      createdBy: req.userId
    });

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    console.error('Add student error:', error.message);
    res.status(500).json({ message: 'Server error while adding student' });
  }
});

// @route   PUT /api/students/:id
// @desc    Update an existing student
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, rollNumber, email, phone, course, year, address } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If roll number is being changed, make sure it's not taken by another student
    if (rollNumber && rollNumber !== student.rollNumber) {
      const duplicate = await Student.findOne({ rollNumber });
      if (duplicate) {
        return res.status(400).json({ message: 'Another student already has this roll number' });
      }
    }

    student.name = name || student.name;
    student.rollNumber = rollNumber || student.rollNumber;
    student.email = email || student.email;
    student.phone = phone !== undefined ? phone : student.phone;
    student.course = course || student.course;
    student.year = year || student.year;
    student.address = address !== undefined ? address : student.address;

    const updatedStudent = await student.save();

    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Update student error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid student id' });
    }
    res.status(500).json({ message: 'Server error while updating student' });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.deleteOne();

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid student id' });
    }
    res.status(500).json({ message: 'Server error while deleting student' });
  }
});

module.exports = router;
