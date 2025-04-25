import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 font-bold text-xl">BINANCE</span>
              <span className="text-white font-bold text-xl">FUTURES</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted platform for cryptocurrency futures trading. 
              Trade with confidence on the world's leading crypto exchange.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon="twitter" />
              <SocialIcon icon="telegram" />
              <SocialIcon icon="discord" />
              <SocialIcon icon="reddit" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Products</h3>
            <ul className="space-y-2">
              <FooterLink text="Spot Trading" />
              <FooterLink text="Futures Trading" />
              <FooterLink text="Options Trading" />
              <FooterLink text="Copy Trading" />
              <FooterLink text="Trading Bots" />
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <FooterLink text="API Documentation" />
              <FooterLink text="Institutional Services" />
              <FooterLink text="Referral Program" />
              <FooterLink text="Affiliate Program" />
              <FooterLink text="Bug Bounty" />
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <FooterLink text="Help Center" />
              <FooterLink text="Trading Rules" />
              <FooterLink text="Fees" />
              <FooterLink text="API Support" />
              <FooterLink text="Contact Us" />
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} BinanceFutures. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap justify-center md:justify-start space-x-6">
                <li><a href="#" className="text-gray-400 hover:text-yellow-500 text-sm">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-500 text-sm">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-500 text-sm">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-500 text-sm">Disclaimers</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ text: string }> = ({ text }) => (
  <li>
    <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
      {text}
    </a>
  </li>
);

const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => (
  <a
    href="#"
    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-500 transition-colors"
  >
    <span className="sr-only">{icon}</span>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  </a>
);

export default Footer;