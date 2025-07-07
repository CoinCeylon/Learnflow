import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { QuizApp } from "./components/QuizApp";
import { SignInModal } from "./components/SignInModal";
import { Footer } from "./components/Footer";
import { WalletProvider } from "./components/WalletProvider";
import { useState, useEffect } from "react";

export default function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  // Auto-close sign-in modal when user becomes authenticated
  useEffect(() => {
    if (loggedInUser && isSignInModalOpen) {
      setIsSignInModalOpen(false);
    }
  }, [loggedInUser, isSignInModalOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-light">
        <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md h-14 sm:h-16 flex justify-between items-center border-b border-secondary/20 shadow-sm px-3 sm:px-4 lg:px-6">
          <div className="flex items-center space-x-2 min-w-0">
            <img 
              src="https://imghost.net/ib/sxl1RdarvDfWycC_1751921188.png" 
              alt="LearnFlow Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0"
              onError={(e) => {
                // Fallback to emoji if image fails to load
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) nextElement.style.display = 'inline';
              }}
            />
            <span className="text-xl sm:text-2xl hidden">🎓</span>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary truncate">LearnFlow</h2>
          </div>
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </header>
        <main className="flex items-center justify-center p-2 sm:p-4 lg:p-6 min-h-0 flex-1">
          <div className="w-full max-w-7xl mx-auto">
            <Content setIsSignInModalOpen={setIsSignInModalOpen} />
          </div>
        </main>
      </div>
      
      <Footer onSignInClick={() => setIsSignInModalOpen(true)} />
      
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
      <Toaster />
    </div>
  );
}

function Content({ setIsSignInModalOpen }: { setIsSignInModalOpen: (open: boolean) => void }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Authenticated>
        <WalletProvider>
          <QuizApp />
        </WalletProvider>
      </Authenticated>
      
      <Unauthenticated>
        <Homepage setIsSignInModalOpen={setIsSignInModalOpen} />
      </Unauthenticated>
    </div>
  );
}

function Homepage({ setIsSignInModalOpen }: { setIsSignInModalOpen: (open: boolean) => void }) {

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-12 sm:w-20 h-12 sm:h-20 bg-indigo-500 rounded-full"></div>
          <div className="absolute top-16 sm:top-32 right-8 sm:right-16 w-8 sm:w-16 h-8 sm:h-16 bg-purple-500 rounded-full"></div>
          <div className="absolute bottom-12 sm:bottom-20 left-8 sm:left-20 w-6 sm:w-12 h-6 sm:h-12 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 w-16 sm:w-24 h-16 sm:h-24 bg-pink-500 rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-secondary rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <img 
                src="https://imghost.net/ib/sxl1RdarvDfWycC_1751921188.png" 
                alt="LearnFlow Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) nextElement.style.display = 'inline';
                }}
              />
              <span className="text-2xl sm:text-3xl lg:text-4xl hidden">🎓</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 sm:mb-4 lg:mb-6 leading-tight">
              LearnFlow
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-secondary mb-2 sm:mb-3 lg:mb-4 max-w-4xl mx-auto leading-relaxed px-2">
              The Future of Learning is Here
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-secondary/70 max-w-3xl mx-auto mb-4 sm:mb-6 lg:mb-8 px-2 leading-relaxed">
              Master new skills, test your knowledge, and earn verifiable blockchain credentials that prove your expertise to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 lg:mb-4">📚</div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-dark mb-1 sm:mb-2">Interactive Learning</h3>
              <p className="text-xs sm:text-sm lg:text-base text-secondary leading-relaxed">Engage with carefully crafted quizzes designed to test and reinforce your knowledge.</p>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 lg:mb-4">🏆</div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-dark mb-1 sm:mb-2">Earn NFT Badges</h3>
              <p className="text-xs sm:text-sm lg:text-base text-secondary leading-relaxed">Perfect scores unlock unique NFT achievement badges minted on the Cardano blockchain.</p>
            </div>
            
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-primary/20 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 lg:mb-4">🔗</div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-dark mb-1 sm:mb-2">Blockchain Verified</h3>
              <p className="text-xs sm:text-sm lg:text-base text-secondary leading-relaxed">Your achievements are permanently recorded and verifiable on the blockchain.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base min-h-[48px] flex items-center justify-center"
            >
              Get Started Free
            </button>
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="w-full sm:w-auto bg-white border-2 border-primary/30 hover:border-primary text-primary font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all hover:bg-primary/5 text-sm sm:text-base min-h-[48px] flex items-center justify-center"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-3 sm:mb-4">How It Works</h2>
          <p className="text-base sm:text-lg lg:text-xl text-secondary max-w-2xl mx-auto px-2">
            Simple steps to start your learning journey and earn blockchain credentials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-lg font-semibold text-dark mb-2">Sign Up</h3>
            <p className="text-secondary">Create your account and join the LearnFlow community</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
              <span className="text-2xl font-bold text-secondary">2</span>
            </div>
            <h3 className="text-lg font-semibold text-dark mb-2">Take Quiz</h3>
            <p className="text-secondary">Challenge yourself with our interactive quizzes</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-lg font-semibold text-dark mb-2">Perfect Score</h3>
            <p className="text-secondary">Achieve 100% to unlock your NFT badge</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
              <span className="text-2xl font-bold text-secondary">4</span>
            </div>
            <h3 className="text-lg font-semibold text-dark mb-2">Earn Badge</h3>
            <p className="text-secondary">Receive your blockchain-verified achievement</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-dark to-secondary rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-white">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Why Choose LearnFlow?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-light/80 max-w-2xl mx-auto px-2">
            Experience the next generation of learning with blockchain-powered credentials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
            <p className="text-light/80">Your achievements are instantly verifiable on the blockchain, no waiting required.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Global Recognition</h3>
            <p className="text-light/80">Blockchain credentials are recognized worldwide and can't be faked or lost.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure & Permanent</h3>
            <p className="text-light/80">Your achievements are permanently stored on the blockchain, safe from loss or tampering.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2">Unique NFTs</h3>
            <p className="text-light/80">Each achievement badge is a unique NFT that represents your specific accomplishment.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-light/80">Learn anywhere, anytime with our responsive design that works on all devices.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Future Ready</h3>
            <p className="text-light/80">Built on cutting-edge blockchain technology for the future of digital credentials.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-3 sm:mb-4">Ready to Start Learning?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-secondary mb-6 sm:mb-8 px-2">
            Join thousands of learners who are already earning blockchain-verified credentials
          </p>
          
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/20 mb-8">
            <div className="text-lg font-semibold text-dark mb-4">🎯 Current Quiz Available:</div>
            <div className="text-2xl font-bold text-primary mb-2">Blockchain Fundamentals</div>
            <p className="text-secondary mb-6">Test your knowledge of blockchain technology, Cardano, and NFTs</p>
            
            <div className="inline-flex items-center space-x-4 text-sm text-secondary/70">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                3 Questions
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                Perfect Score Required
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-primary/70 rounded-full mr-2"></span>
                NFT Badge Reward
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSignInModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Start Learning Now
          </button>
        </div>
      </section>

    </div>
  );
}
