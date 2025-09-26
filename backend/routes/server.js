const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Server = require('../models/Server');

// GET /api/servers - Get all servers for user
router.get('/', requireAuth, async (req, res) => {
  try {
    const servers = await Server.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        servers: servers.map(server => ({
          id: server._id,
          name: server.name,
          status: server.status,
          ramGB: server.ramGB,
          usage: server.usage,
          createdAt: server.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching servers'
    });
  }
});

// POST /api/servers - Create a new server
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, ramGB = 1 } = req.body;

    // Validate input
    if (!name || name.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Server name is required'
      });
    }

    if (ramGB < 1 || ramGB > 16) {
      return res.status(400).json({
        success: false,
        message: 'RAM must be between 1 and 16 GB'
      });
    }

    // Create server
    const server = new Server({
      name: name.trim(),
      ramGB,
      status: 'stopped',
      usage: 0,
      user: req.user._id
    });

    await server.save();

    res.status(201).json({
      success: true,
      message: 'Server created successfully',
      data: {
        server: {
          id: server._id,
          name: server.name,
          status: server.status,
          ramGB: server.ramGB,
          usage: server.usage,
          createdAt: server.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating server'
    });
  }
});

// POST /api/servers/:id/toggle - Toggle server status
router.post('/:id/toggle', requireAuth, async (req, res) => {
  try {
    const server = await Server.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!server) {
      return res.status(404).json({
        success: false,
        message: 'Server not found'
      });
    }

    // Toggle status
    server.status = server.status === 'running' ? 'stopped' : 'running';
    server.usage = server.status === 'running' ? Math.floor(Math.random() * 100) + 1 : 0;
    
    await server.save();

    res.json({
      success: true,
      message: `Server ${server.status === 'running' ? 'started' : 'stopped'} successfully`,
      data: {
        server: {
          id: server._id,
          name: server.name,
          status: server.status,
          ramGB: server.ramGB,
          usage: server.usage
        }
      }
    });
  } catch (error) {
    console.error('Toggle server error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling server status'
    });
  }
});

// DELETE /api/servers/:id - Delete a server
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const server = await Server.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!server) {
      return res.status(404).json({
        success: false,
        message: 'Server not found'
      });
    }

    res.json({
      success: true,
      message: 'Server deleted successfully'
    });
  } catch (error) {
    console.error('Delete server error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting server'
    });
  }
});

module.exports = router;
