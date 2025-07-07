interface FooterProps {
  onSignInClick: () => void;
}

export function Footer({ onSignInClick }: FooterProps) {
  return (
    <footer className="bg-gradient-to-r from-dark to-secondary text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl mb-4">
              <img 
                src="https://imghost.net/ib/sxl1RdarvDfWycC_1751921188.png" 
                alt="LearnFlow Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) nextElement.style.display = 'inline';
                }}
              />
              <span className="text-xl hidden">🎓</span>
            </div>
            <h3 className="text-xl font-bold mb-2">LearnFlow</h3>
            <p className="text-light/80 text-sm">
              The future of interactive learning with AI-powered content and achievement tracking
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-light/70">
              <li>
                <button 
                  onClick={onSignInClick} 
                  className="hover:text-white transition-colors"
                >
                  Get Started
                </button>
              </li>
              <li><span className="cursor-default">Interactive Quizzes</span></li>
              <li><span className="cursor-default">AI Content Generation</span></li>
              <li><span className="cursor-default">Achievement Badges</span></li>
            </ul>
          </div>

          {/* Technology */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-4">Built With</h4>
            <ul className="space-y-2 text-sm text-light/70">
              <li>React & TypeScript</li>
              <li>Convex Database</li>
              <li>AI-Powered Content</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-light/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-light/60 mb-4 md:mb-0">
            © 2025 LearnFlow. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-light/60">Created by</span>
            <span className="font-semibold bg-gradient-to-r from-primary to-light bg-clip-text text-transparent">
              The Houdinis
            </span>
            <span className="text-lg">✨</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
