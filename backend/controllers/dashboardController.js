const getDashboard = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Welcome to your dashboard',
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          username: req.user.username
        },
        dashboard: {
          message: `Hello ${req.user.username}! Welcome to AuraDeploy dashboard.`,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accessing dashboard'
    });
  }
};

module.exports = {
  getDashboard
};
