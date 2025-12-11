import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, PieChart, Shield, Smartphone, BarChart3 } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl">ExpenseTracker</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl mb-6">
            Take Control of Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Future
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track expenses, analyze spending patterns, and make smarter financial decisions with our intuitive expense tracking platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all text-lg"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:shadow-lg transition-all text-lg border border-gray-200"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <p className="text-blue-100 mb-2">Total Spent</p>
                <p className="text-3xl">$2,847.50</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <p className="text-purple-100 mb-2">Avg. Daily</p>
                <p className="text-3xl">$94.92</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
                <p className="text-pink-100 mb-2">This Month</p>
                <p className="text-3xl">$1,245.00</p>
              </div>
            </div>
            <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-16 h-16 text-gray-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Everything You Need to Manage Your Money</h2>
          <p className="text-xl text-gray-600">Powerful features to help you stay on top of your finances</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl mb-3">Easy Expense Tracking</h3>
            <p className="text-gray-600">
              Quickly add and categorize your expenses with an intuitive interface. Track every dollar with ease.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl mb-3">Detailed Analytics</h3>
            <p className="text-gray-600">
              Visualize your spending patterns with interactive charts and graphs. Monthly and yearly insights.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl mb-3">Category Breakdown</h3>
            <p className="text-gray-600">
              See exactly where your money goes with detailed category breakdowns and spending analysis.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your financial data is stored securely. We prioritize your privacy and data protection.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl mb-3">Mobile Friendly</h3>
            <p className="text-gray-600">
              Access your expenses anywhere, anytime. Fully responsive design works on all devices.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl mb-3">Smart Insights</h3>
            <p className="text-gray-600">
              Get actionable insights about your spending habits and make informed financial decisions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl mb-4">Ready to Take Control?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users who are already managing their finances smarter
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-xl transition-all text-lg"
          >
            Start Tracking Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 ExpenseTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
