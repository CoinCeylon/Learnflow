import { useState } from "react";
import { SignInForm } from "../SignInForm";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="modal-content animate-slide-up">
        <div className="p-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-secondary/60 hover:text-secondary transition-colors p-1 rounded-full hover:bg-gray-100 z-10"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-4 pt-6">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl mb-2">
              <img 
                src="https://imghost.net/ib/sxl1RdarvDfWycC_1751921188.png" 
                alt="LearnFlow Logo" 
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) nextElement.style.display = 'inline';
                }}
              />
              <span className="text-lg hidden">🎓</span>
            </div>
            <h2 className="text-lg font-bold text-dark mb-1">Welcome to LearnFlow</h2>
            <p className="text-xs text-secondary">Sign in to start your learning journey</p>
          </div>

          {/* Sign in form */}
          <div className="auth-form-spacing">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}
